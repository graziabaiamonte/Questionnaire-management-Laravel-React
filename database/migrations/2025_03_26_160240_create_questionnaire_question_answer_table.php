<?php

use App\Models\QuestionnaireQuestion;
use App\Models\QuestionnaireQuestionOption;
use App\Models\QuestionnaireUserState;
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
        Schema::create('questionnaire_question_answer', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(QuestionnaireQuestion::class)->constrained('questionnaire_question')->cascadeOnDelete();
            $table->foreignIdFor(QuestionnaireQuestionOption::class)->nullable()->constrained('questionnaire_question_option')->cascadeOnDelete()->name('fk_question_option');
            $table->foreignIdFor(QuestionnaireUserState::class)->constrained('questionnaire_user_state')->cascadeOnDelete()->name('questionnaire_user_state_id');
            $table->text('answer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaire_question_answer');
    }
};
