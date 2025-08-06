<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDivisionRequest;
use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $divisions = Division::withCount('users')->latest()->paginate(10);
        
        return Inertia::render('divisions/index', [
            'divisions' => $divisions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }
        
        return Inertia::render('divisions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request)
    {
        $division = Division::create($request->validated());
        
        return redirect()->route('divisions.show', $division)
            ->with('success', 'Division created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Division $division)
    {
        $division->load(['users', 'tasks.creator']);
        
        return Inertia::render('divisions/show', [
            'division' => $division,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Division $division)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }
        
        return Inertia::render('divisions/edit', [
            'division' => $division,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Division $division)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:divisions,name,' . $division->id,
            'description' => 'nullable|string',
        ]);
        
        $division->update($validated);
        
        return redirect()->route('divisions.show', $division)
            ->with('success', 'Division updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division)
    {
        if (!auth()->user()->isAdministrator()) {
            abort(403);
        }
        
        $division->delete();
        
        return redirect()->route('divisions.index')
            ->with('success', 'Division deleted successfully.');
    }
}