<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Division;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $query = Task::with(['creator', 'assignedDivision', 'assignedUser', 'takenByUser']);
        
        // Filter tasks based on user role
        if ($user->isManager()) {
            // Managers see all tasks they created
            $tasks = $query->where('created_by', $user->id)->latest()->paginate(12);
        } elseif ($user->isDivisionMember() && $user->division_id) {
            // Division members see tasks assigned to their division
            $tasks = $query->where('assigned_division_id', $user->division_id)->latest()->paginate(12);
        } else {
            // Individual users see tasks assigned to them
            $tasks = $query->where('assigned_user_id', $user->id)->latest()->paginate(12);
        }
        
        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isManager()) {
            abort(403);
        }
        
        $divisions = Division::all();
        $users = User::where('role', '!=', 'administrator')->get();
        
        return Inertia::render('tasks/create', [
            'divisions' => $divisions,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        // Check if this is a task creation or task taking action
        if ($request->has('action') && $request->input('action') === 'take_task') {
            return $this->handleTakeTask($request);
        }

        $validated = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('task-images', 'public');
            $validated['image_path'] = $imagePath;
        }
        
        // Set the creator
        $validated['created_by'] = auth()->id();
        
        // Remove the uploaded file from validated data
        unset($validated['image']);
        
        $task = Task::create($validated);
        
        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $task->load(['creator', 'assignedDivision', 'assignedUser', 'takenByUser']);
        $user = auth()->user();
        
        // Check if user can take this task
        $canTake = false;
        if ($task->status === 'belum_dimulai') {
            if ($task->assignment_type === 'division') {
                $canTake = $user->division_id === $task->assigned_division_id;
            } else {
                $canTake = $user->id === $task->assigned_user_id;
            }
        }
        
        // Check if user can update this task
        $canUpdate = $user->isManager() && $task->created_by === $user->id || 
                    $task->taken_by === $user->id;
        
        return Inertia::render('tasks/show', [
            'task' => $task,
            'userRole' => $user->role,
            'canTake' => $canTake,
            'canUpdate' => $canUpdate,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        if (!auth()->user()->isManager() || $task->created_by !== auth()->id()) {
            abort(403);
        }
        
        $divisions = Division::all();
        $users = User::where('role', '!=', 'administrator')->get();
        
        return Inertia::render('tasks/edit', [
            'task' => $task,
            'divisions' => $divisions,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $validated = $request->validated();
        
        // Handle work result image upload
        if ($request->hasFile('work_result_image')) {
            // Delete old work result image if exists
            if ($task->work_result_image) {
                Storage::disk('public')->delete($task->work_result_image);
            }
            
            $workResultPath = $request->file('work_result_image')->store('work-results', 'public');
            $validated['work_result_image'] = $workResultPath;
        }
        
        $task->update($validated);
        
        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if (!auth()->user()->isManager() || $task->created_by !== auth()->id()) {
            abort(403);
        }
        
        // Delete associated images
        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }
        if ($task->work_result_image) {
            Storage::disk('public')->delete($task->work_result_image);
        }
        
        $task->delete();
        
        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Handle task taking action.
     */
    protected function handleTakeTask(Request $request)
    {
        $taskId = $request->input('task_id');
        
        if (!$taskId) {
            return redirect()->back()->with('error', 'Task ID is required.');
        }
        
        $task = Task::findOrFail($taskId);
        $user = auth()->user();
        
        // Check if user can take this task
        if ($task->status !== 'belum_dimulai') {
            return redirect()->back()->with('error', 'Task is not available.');
        }
        
        $canTake = false;
        if ($task->assignment_type === 'division') {
            $canTake = $user->division_id === $task->assigned_division_id;
        } else {
            $canTake = $user->id === $task->assigned_user_id;
        }
        
        if (!$canTake) {
            return redirect()->back()->with('error', 'You cannot take this task.');
        }
        
        $task->update([
            'status' => 'sedang_dikerjakan',
            'taken_by' => auth()->id(),
        ]);
        
        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task taken successfully.');
    }
}