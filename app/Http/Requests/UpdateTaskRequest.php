<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && (
            auth()->user()->isManager() || 
            $this->route('task')->taken_by === auth()->id()
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [];
        
        // Manager can update basic task info
        if (auth()->user()->isManager()) {
            $rules = [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'due_date' => 'sometimes|date|after:today',
                'priority_level' => 'sometimes|in:low,medium,high,urgent',
                'status' => 'sometimes|in:belum_dimulai,sedang_dikerjakan,di_tinjau,diterima,selesai',
            ];
        }
        
        // Worker can update time estimate, items completed, and upload work result
        if ($this->route('task')->taken_by === auth()->id()) {
            $rules = array_merge($rules, [
                'current_time_estimate' => 'sometimes|integer|min:1',
                'items_completed' => 'sometimes|integer|min:0',
                'work_result_image' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
            ]);
        }
        
        return $rules;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.string' => 'Task name must be text.',
            'description.string' => 'Task description must be text.',
            'due_date.after' => 'Due date must be in the future.',
            'current_time_estimate.integer' => 'Time estimate must be a number.',
            'current_time_estimate.min' => 'Time estimate must be at least 1.',
            'items_completed.integer' => 'Items completed must be a number.',
            'items_completed.min' => 'Items completed cannot be negative.',
            'work_result_image.image' => 'Work result must be an image.',
            'work_result_image.mimes' => 'Work result image must be JPG or PNG.',
        ];
    }
}