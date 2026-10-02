<?php

use App\Models\QuestionnaireQuestion;
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
        Schema::create('questionnaire_question_option', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(QuestionnaireQuestion::class)->constrained('questionnaire_question')->cascadeOnDelete();
            $table->text('content');
            $table->unsignedInteger('order_column')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaire_question_option');
    }
};
