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
    public function index(Request $request, FinancialFlow $financialFlow)
    {

        $perPage = $request->input('perPage', 20);

        $query = FinancialLaunch::query();
        if ($financialFlow) {
            $query->where('financial_flow_id', $financialFlow->id);
        }



        $financialLaunches = $query->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

            foreach ($financialLaunches as $launch) {
                $totalRevenues = $launch->revenues()->sum('value');
                $totalExpenses = $launch->expenses()->sum('value');
                $net_worth = $totalRevenues - $totalExpenses;
                $launch->totalRevenues = $totalRevenues;
                $launch->totalExpenses = $totalExpenses;
                $launch->net_worth = $net_worth;
            }

       

        return inertia('FinancialLanches/Index', [
            'financialLaunches' => $financialLaunches,
            'financial_flow_id' => $financialFlow ? $financialFlow->id : null,
            'totalRevenues' => $financialLaunches->sum('totalRevenues'),
            'totalExpenses' => $financialLaunches->sum('totalExpenses'),
            'netWorth' => $financialLaunches->sum('net_worth'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, FinancialFlow $financialFlow)
    {
        $financial_flow_id = $financialFlow ? $financialFlow->id : null;
        return inertia('FinancialLanches/Create', [
            'financial_flow_id' => $financial_flow_id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FinancialFlow $financialFlow)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m'
        ]);

        // Ensure the stored date has day = 1 (Y-m-01)
        $month = Carbon::createFromFormat('Y-m', $request->month)->startOfMonth()->toDateString();

        FinancialLaunch::create([
            'month' => $month,
            'financial_flow_id' => $financialFlow->id,
        ]);


        return to_route('financial-launches.index', ['financial_flow' => $financialFlow->id])->with('success', 'Financial Launch created successfully.');
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
    public function edit(FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {

        return inertia('FinancialLanches/Edit', [
            'financialLaunch' => $financialLaunch,
            'financial_flow_id' => $financialFlow->id,
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
    public function destroy(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
      try {

            if ($financialLaunch->revenues()->exists() || $financialLaunch->expenses()->exists()) {
                $message = 'Cannot delete Financial Launch with associated Revenues or Expenses.';
                if ($request->wantsJson()) {
                    return response()->json(['message' => $message], 409);
                }
                return redirect()->back()->with('error', $message);
            }

            $financialLaunch->delete();

            $message = 'Financial Launch     deleted successfully.';
            if ($request->wantsJson()) {
                return response()->json(['message' => $message], 200);
            }

            return to_route('financial-launches.index', ['financial_flow_id' => $financialLaunch->financial_flow_id])->with('success', $message);
        } catch (\Throwable $e) {
            $msg = $e->getMessage() ?: 'Delete failed.';
            if ($request->wantsJson()) {
                return response()->json(['message' => $msg], 500);
            }
            return redirect()->back()->with('error', $msg);
        }
    }
}
