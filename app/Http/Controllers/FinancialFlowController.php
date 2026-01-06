<?php

namespace App\Http\Controllers;

use App\Models\FinancialFlow;
use Illuminate\Http\Request;

class FinancialFlowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $perPage = $request->input('perPage', 20);

        $financialFlows = FinancialFlow::orderBy('id', 'desc')->paginate($perPage)->withQueryString();
        return inertia('FinancialFlows/Index', [
            'financialFlows' => $financialFlows,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('FinancialFlows/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      
        // dd($request->all());
        $request->validate([
            // expect a date string (YYYY-MM-DD). Use date validation and keep uniqueness on the column
           'year' => 'required|digits:4|integer|unique:financial_flows,year',
        ]);

        FinancialFlow::create([
            'year' => $request->year,
        ]);
        return to_route('financial-flows.index')->with('success', 'Financial Flow created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FinancialFlow $financialFlow)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialFlow $financialFlow)
    {
        
        return inertia('FinancialFlows/Edit', [
            'financialFlow' => $financialFlow,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialFlow $financialFlow)
    {
        
        $request->validate([
            // expect a date string (YYYY-MM-DD). Use date validation and keep uniqueness on the column
           'year' => 'required|digits:4|integer|unique:financial_flows,year,'.$financialFlow->id,
        ]);

        $financialFlow->update([
            'year' => $request->year,
        ]);
        return to_route('financial-flows.index')->with('success', 'Financial Flow updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(FinancialFlow $financialFlow)
    {
        $financialFlow->delete();
        

        return response()->noContent(202);
    }

        public function destroy(Request $request, FinancialFlow $financialFlow)
    {
        try {
     
            if ($financialFlow->financialLaunches()->exists()) {
                $message = 'Cannot delete Financial Flow with associated Financial Launches.';
                if ($request->wantsJson()) {
                    return response()->json(['message' => $message], 409);
                }
                return redirect()->back()->with('error', $message);
            }

            $financialFlow->delete();

            $message = 'Financial Flow deleted successfully.';
            if ($request->wantsJson()) {
                return response()->json(['message' => $message], 200);
            }

            return to_route('financial-flows.index')->with('success', $message);
        } catch (\Throwable $e) {
            $msg = $e->getMessage() ?: 'Delete failed.';
            if ($request->wantsJson()) {
                return response()->json(['message' => $msg], 500);
            }
            return redirect()->back()->with('error', $msg);
        }
    }
}
