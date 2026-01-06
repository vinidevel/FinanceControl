<?php

namespace App\Http\Controllers;

use App\Models\Revenue;
use App\Models\RevenueType;
use Illuminate\Http\Request;

class RevenueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $perPage = $request->input('perPage', 20);
        $id = $request->input('financial_launch_id');

        $query = Revenue::query();
        if ($id) {
            $query->where('financial_launch_id', $id);
        }

        $revenues = $query->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return inertia('Revenues/Index', [
            'revenues' => $revenues,
            'financial_launch_id' => $id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $revenueTypes = RevenueType::orderBy('name')->get();

        return inertia('Revenues/Create', [
            'revenue_types' => $revenueTypes,
            'financial_launch_id' => $request->input('financial_launch_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'financial_launch_id' => 'required|exists:financial_launches,id',
            'revenue_type_id' => 'required|exists:revenue_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        Revenue::create($data);

        return redirect()->route('revenues.index', ['financial_launch_id' => $data['financial_launch_id']])->with('success', trans('Revenue created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Revenue $revenue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Revenue $revenue)
    {
        $revenueTypes = RevenueType::orderBy('name')->get();

        return inertia('Revenues/Edit', [
            'revenue' => $revenue,
            'revenue_types' => $revenueTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Revenue $revenue)
    {
        $data = $request->validate([
            'financial_launch_id' => 'required|exists:financial_launches,id',
            'revenue_type_id' => 'required|exists:revenue_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $revenue->update($data);

        return redirect()->route('revenues.index', ['financial_launch_id' => $data['financial_launch_id']])->with('success', trans('Revenue updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Revenue $revenue)
    {
        $financialLaunchId = $revenue->financial_launch_id;
        $revenue->delete();

        return redirect()->route('revenues.index', ['financial_launch_id' => $financialLaunchId])->with('success', trans('Revenue deleted successfully.'));
    }
}
