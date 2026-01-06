<?php

namespace App\Http\Controllers;

use App\Models\FinancialFlow;
use App\Models\FinancialLaunch;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FinancialLaunchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 20);
        $id = $request->input('financial_flow_id');

        $query = FinancialLaunch::query();
        if ($id) {
            $query->where('financial_flow_id', $id);
        }

        $financialLaunches = $query->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return inertia('FinancialLanches/Index', [
            'financialLaunches' => $financialLaunches,
            'financial_flow_id' => $id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $financial_flow_id = $request->input('financial_flow_id');
        return inertia('FinancialLanches/Create', [
            'financial_flow_id' => $financial_flow_id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
            'financial_flow_id' => 'required|exists:financial_flows,id',
        ]);

        // Ensure the stored date has day = 1 (Y-m-01)
        $month = Carbon::createFromFormat('Y-m', $request->month)->startOfMonth()->toDateString();

        FinancialLaunch::create([
            'month' => $month,
            'financial_flow_id' => $request->financial_flow_id,
        ]);

        return to_route('financial-launches.index', ['financial_flow_id' => $request->financial_flow_id])->with('success', 'Financial Launch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FinancialLaunch $financialLaunch)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialLaunch $financialLaunch)
    {
        return inertia('FinancialLanches/Edit', [
            'financialLaunch' => $financialLaunch,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialLaunch $financialLaunch)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $month = Carbon::createFromFormat('Y-m', $request->month)->startOfMonth()->toDateString();

        $financialLaunch->update([
            'month' => $month,
        ]);

        return to_route('financial-launches.index', ['financial_flow_id' => $financialLaunch->financial_flow_id])->with('success', 'Financial Launch updated successfully.');
       
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinancialLaunch $financialLaunch)
    {
        $financialLaunch->delete();
        return response()->noContent(202);
    }
}
