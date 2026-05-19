<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PaymentMethod::create(['name' => 'Pix']);
        PaymentMethod::create(['name' => 'Cartão de Crédito']);
        PaymentMethod::create(['name' => 'Cartão de Débito']);
        PaymentMethod::create(['name' => 'Boleto Bancário']);

    }
}
