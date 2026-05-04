<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseType;
use App\Models\FinancialFlow;
use App\Models\FinancialLaunch;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $perPage = $request->input('perPage', 20);


        $query = Expense::query();
        if ($financialLaunch) {
            $query->where('financial_launch_id', $financialLaunch->id);
        }


        $expenses = $query->with(['expenseType', 'paymentMethod'])->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

            // dd($expenses->toArray());

        return inertia('Expenses/Index', [
            'expenses' => $expenses,
            'financial_launch_id' => $financialLaunch ? $financialLaunch->id : null,
            'financial_flow_id' => $financialFlow ? $financialFlow->id : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $expenseTypes = ExpenseType::orderBy('name')->get();
        $paymentMethods = PaymentMethod::orderBy('name')->get();
        return inertia('Expenses/Create', [
            'expense_types' => $expenseTypes,
            'pay_methods' => $paymentMethods,
            'financial_launch_id' => $financialLaunch->id,
            'financial_flow_id' => $financialFlow->id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $request->validate([
            'expenseType' => 'required|exists:expense_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
            'paymentMethod' => 'required|exists:payment_methods,id',
            'date_expense' => 'required|date',

        ]);
        // dd($request->all());
        $data = $request->only(['value', 'description', 'payment_method_id', 'date_expense']);
        $data['financial_launch_id'] = $financialLaunch->id;
        $data['expense_type_id'] = $request->expenseType;
        $data['payment_method_id'] = $request->paymentMethod;

        Expense::create($data);

        return redirect()->route('expenses.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', trans('Expense created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialFlow $financialFlow, FinancialLaunch $financialLaunch,Expense $expense)
    {
        $expenseTypes = ExpenseType::orderBy('name')->get();
        $paymentMethods = PaymentMethod::orderBy('name')->get();

        return inertia('Expenses/Edit', [
            'expense' => $expense->load(['expenseType', 'paymentMethod']),
            'expense_types' => $expenseTypes,
            'payment_methods' => $paymentMethods,
            'financial_launch_id' => $financialLaunch->id,
            'financial_flow_id' => $financialFlow->id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Expense $expense)
    {
     
        $request->validate([
            'expense_type_id' => 'required|exists:expense_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'date_expense' => 'required|date',
        ]);

        $data = $request->only(['expense_type_id', 'value', 'description', 'payment_method_id', 'date_expense']);

        $expense->update($data);

        return redirect()->route('expenses.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', trans('Expense updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Expense $expense)
    {

        try {

            $expense->delete();

            $message = trans('Expense deleted successfully.');
            if ($request->wantsJson()) {
                return response()->json(['message' => $message], 200);
            }

            return to_route('expenses.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', $message);
        } catch (\Throwable $e) {
            $msg = $e->getMessage() ?: trans('Delete failed.');
            if ($request->wantsJson()) {
                return response()->json(['message' => $msg], 500);
            }
            return redirect()->back()->with('error', $msg);
        }
    }
}
