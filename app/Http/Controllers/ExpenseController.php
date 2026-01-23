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

        ]);
        // dd($request->all());
        $data = $request->only(['value', 'description', 'payment_method_id']);
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
    public function edit(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        //
    }
}
