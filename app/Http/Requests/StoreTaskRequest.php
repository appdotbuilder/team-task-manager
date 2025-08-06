<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow task taking by any authenticated user
        if ($this->input('action') === 'take_task') {
            return auth()->check();
        }
        
        // Only managers can create tasks
        return auth()->user() && auth()->user()->isManager();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // If this is a task taking action, different validation rules apply
        if ($this->input('action') === 'take_task') {
            return [
                'action' => 'required|string',
                'task_id' => 'required|exists:tasks,id',
            ];
        }
        
        // Normal task creation validation
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'due_date' => 'required|date|after:today',
            'priority_level' => 'required|in:low,medium,high,urgent',
            'assignment_type' => 'required|in:division,user',
            'assigned_division_id' => 'required_if:assignment_type,division|exists:divisions,id',
            'assigned_user_id' => 'required_if:assignment_type,user|exists:users,id',
            'initial_time_estimates' => 'required|array|min:2|max:3',
            'initial_time_estimates.*' => 'required|integer|min:1',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Task name is required.',
            'description.required' => 'Task description is required.',
            'image.required' => 'Task image is required.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a JPG or PNG file.',
            'due_date.required' => 'Due date is required.',
            'due_date.after' => 'Due date must be in the future.',
            'assignment_type.required' => 'Please specify assignment type.',
            'assigned_division_id.required_if' => 'Please select a division.',
            'assigned_user_id.required_if' => 'Please select a user.',
            'initial_time_estimates.required' => 'Please provide 2-3 initial time estimates.',
            'initial_time_estimates.min' => 'Please provide at least 2 time estimates.',
            'initial_time_estimates.max' => 'Please provide no more than 3 time estimates.',
        ];
    }
}