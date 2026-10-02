<?php

use App\Models\Questionnaire;
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
        Schema::create('questionnaire_question', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Questionnaire::class)->constrained('questionnaires')->cascadeOnDelete();
            $table->text('type');
            $table->text('label');
            $table->text('description')->nullable();
            $table->unsignedInteger('order_column')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaire_question');
    }
};
