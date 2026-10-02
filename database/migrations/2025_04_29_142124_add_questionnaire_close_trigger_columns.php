<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add questionnaire_close_trigger to projects table
        Schema::table('projects', function (Blueprint $table) {
            $table->string('questionnaire_close_trigger')
                ->default('manual')
                ->after('company_id');
        });

        // Add questionnaire_close_trigger and closed columns to questionnaires table
        Schema::table('questionnaires', function (Blueprint $table) {
            $table->string('questionnaire_close_trigger')
                ->after('order_column')
                ->nullable();
            $table->boolean('closed')
                ->default(false)
                ->after('questionnaire_close_trigger');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('questionnaire_close_trigger');
        });

        Schema::table('questionnaires', function (Blueprint $table) {
            $table->dropColumn(['questionnaire_close_trigger', 'closed']);
        });
    }
};
