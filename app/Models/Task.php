<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Task
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $image_path
 * @property string $due_date
 * @property string $priority_level
 * @property string $status
 * @property string $assignment_type
 * @property int|null $assigned_division_id
 * @property int|null $assigned_user_id
 * @property int $created_by
 * @property int|null $taken_by
 * @property array $initial_time_estimates
 * @property int|null $current_time_estimate
 * @property int $items_completed
 * @property string|null $work_result_image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Division|null $assignedDivision
 * @property-read \App\Models\User|null $assignedUser
 * @property-read \App\Models\User $creator
 * @property-read \App\Models\User|null $takenByUser
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereAssignedDivisionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereAssignedUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereAssignmentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereCurrentTimeEstimate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereInitialTimeEstimates($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereItemsCompleted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task wherePriorityLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereTakenBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task whereWorkResultImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Task belumDimulai()
 * @method static \Illuminate\Database\Eloquent\Builder|Task sedangDikerjakan()
 * @method static \Illuminate\Database\Eloquent\Builder|Task diTinjau()
 * @method static \Illuminate\Database\Eloquent\Builder|Task diterima()
 * @method static \Illuminate\Database\Eloquent\Builder|Task selesai()
 * @method static \Illuminate\Database\Eloquent\Builder|Task highPriority()
 * @method static \Illuminate\Database\Eloquent\Builder|Task urgentPriority()
 * @method static \Database\Factories\TaskFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'image_path',
        'due_date',
        'priority_level',
        'status',
        'assignment_type',
        'assigned_division_id',
        'assigned_user_id',
        'created_by',
        'taken_by',
        'initial_time_estimates',
        'current_time_estimate',
        'items_completed',
        'work_result_image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'due_date' => 'date',
        'initial_time_estimates' => 'array',
        'items_completed' => 'integer',
        'current_time_estimate' => 'integer',
    ];

    /**
     * Get the division this task is assigned to.
     */
    public function assignedDivision(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'assigned_division_id');
    }

    /**
     * Get the user this task is assigned to.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * Get the user who created this task.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who took this task.
     */
    public function takenByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'taken_by');
    }

    /**
     * Scope a query to only include tasks that haven't started.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBelumDimulai($query)
    {
        return $query->where('status', 'belum_dimulai');
    }

    /**
     * Scope a query to only include tasks in progress.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSedangDikerjakan($query)
    {
        return $query->where('status', 'sedang_dikerjakan');
    }

    /**
     * Scope a query to only include tasks under review.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDiTinjau($query)
    {
        return $query->where('status', 'di_tinjau');
    }

    /**
     * Scope a query to only include accepted tasks.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDiterima($query)
    {
        return $query->where('status', 'diterima');
    }

    /**
     * Scope a query to only include completed tasks.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSelesai($query)
    {
        return $query->where('status', 'selesai');
    }

    /**
     * Scope a query to only include high priority tasks.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority_level', 'high');
    }

    /**
     * Scope a query to only include urgent priority tasks.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUrgentPriority($query)
    {
        return $query->where('priority_level', 'urgent');
    }
}