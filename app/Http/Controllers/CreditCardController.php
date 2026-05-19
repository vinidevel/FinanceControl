<?php

namespace App\Http\Controllers;

use App\Models\CreditCard;
use Illuminate\Http\Request;

class CreditCardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

       public function fetch_create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:credit_cards,name',
            'expiration_date' => 'required|date',
            'invoice_closing_date' => 'required|date',

        ]);

        $credit_cards = \App\Models\CreditCard::create([
            'name' => $request->name,
            'expiration_date' => $request->expiration_date,
            'invoice_closing_date' => $request->invoice_closing_date,
        ]);

        return response()->json($credit_cards);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    }



    /**
     * Display the specified resource.
     */
    public function show(CreditCard $creditCard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CreditCard $creditCard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CreditCard $creditCard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CreditCard $creditCard)
    {
        //
    }
}
