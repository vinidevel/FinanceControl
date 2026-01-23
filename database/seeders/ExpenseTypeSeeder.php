<?php

namespace Database\Seeders;

use App\Models\ExpenseType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExpenseType::create(['name' => 'Travel']);
        ExpenseType::create(['name' => 'Supplies']);
        ExpenseType::create(['name' => 'Car']);
        ExpenseType::create(['name' => 'Utilities']);
        ExpenseType::create(['name' => 'Maintenance']);
        ExpenseType::create(['name' => 'Clothing']);
        ExpenseType::create(['name' => 'Insurance']);
        ExpenseType::create(['name' => 'Food']);
        ExpenseType::create(['name' => 'Salaries']);
        ExpenseType::create(['name' => 'Health']);
    }
}
