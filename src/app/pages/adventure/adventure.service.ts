import { computed, inject, Injectable } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { kebabCase } from 'lodash';
import { AICodeValidationResponse } from '../../types/ai-code-validation-response';

@Injectable({
  providedIn: 'root',
})
export class AdventureService {
  private readonly supabase = inject(Supabase);

  readonly chapters = ['Checklist', 'Kaartspel', 'Hittegolf', 'Sport', 'Campingplaats'];
  readonly data = computed(() => this.supabase.profile()?.adventure);
  readonly last = computed(() => this.data()?.last);
  readonly progress = computed(() => this.data()?.progress ?? {});
  readonly stars = computed(() => Object.values(this.progress()).filter((x) => !!x).length);
  readonly progressPercentageByChapter = computed(() => {
    const progress = this.progress();
    const steps = 5;

    return this.chapters.reduce(
      (percentages, chapter) => {
        let count = 0;

        for (let step = 1; step <= steps; step++) {
          if (progress[`${kebabCase(chapter)}-${step}`]) {
            count++;
          }
        }

        percentages[kebabCase(chapter)] = (count / steps) * 100;

        return percentages;
      },
      {} as { [chapter: string]: number },
    );
  });
  readonly filterGrayscaleByChapter = computed(() => {
    const progressPercentageByChapter = this.progressPercentageByChapter();

    return Object.keys(progressPercentageByChapter).reduce(
      (grayscales, chapter) => {
        grayscales[chapter] = 100 - progressPercentageByChapter[chapter];
        return grayscales;
      },
      {} as { [chapter: string]: number },
    );
  });
  readonly crowns = computed(() => {
    const progress = this.progress();
    let count = 0;

    for (const chapter of this.chapters) {
      if (
        progress[`${kebabCase(chapter)}-1`] &&
        progress[`${kebabCase(chapter)}-2`] &&
        progress[`${kebabCase(chapter)}-3`] &&
        progress[`${kebabCase(chapter)}-4`] &&
        progress[`${kebabCase(chapter)}-5`]
      ) {
        count++;
      }
    }

    return count;
  });

  reloadData(): void {
    this.supabase.profileResource.reload();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  addStar(exercise: string) {
    return this.supabase
      .updateProfile({
        adventure: {
          last: exercise,
          progress: {
            ...this.progress(),
            [exercise]: true,
          },
        },
      })
      .then(() => this.reloadData());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  validateCodeUsingAI({
    abortSignal,
    answer,
    codingGuidelines,
    constraints,
    exampleSolutions,
    programmingLanguage,
    question,
  }: {
    abortSignal?: AbortSignal;
    answer: string;
    codingGuidelines?: string;
    constraints?: string;
    exampleSolutions?: string;
    programmingLanguage?: string;
    question: string;
  }) {
    // Defaults to vba
    programmingLanguage ??= 'vba';

    return this.supabase.openAICompletion<AICodeValidationResponse>({
      abortSignal,
      systemPrompt: `
        You are an automated code reviewer and programming tutor.

        Your task is to:
          - Evaluate a student's code submission against a clearly defined programming objective.
          - Verify whether the code logically fulfills the objective.
          - Provide concise, constructive feedback suitable for a student.
          - Return ONLY valid JSON that strictly follows the specified output schema.
          - Do NOT include markdown, explanations outside JSON, or additional text.

        Language rule:
          - The values of "feedback" and "tips" MUST be written in Dutch.
          - All other reasoning should remain internal and must not appear in the output.

        Be strict but fair:
          - The solution does not need to match example solutions exactly.
          - The solution MUST satisfy the objective and constraints.
          - Minor style issues should not cause failure unless they break functionality.
      `,
      prompt: `
        TASK / OBJECTIVE:
        ${question}

        PROGRAMMING LANGUAGE:
        ${programmingLanguage}

        OPTIONAL CONSTRAINTS:
        ${constraints ?? ''}

        OPTIONAL CODING GUIDELINES:
          - Lengte van arrays steeds initializeren met een constante variabele.
          - Naamgeving van variabelen en arrays steeds een afkorting van het data type.
        ${codingGuidelines ?? ''}

        OPTIONAL EXAMPLE SOLUTIONS:
        ${exampleSolutions ?? ''}

        STUDENT SUBMISSION:
        ${answer}

        INSTRUCTIONS FOR EVALUATION:
          1. Determine if the student's code fulfills the TASK / OBJECTIVE.
          2. Check logical correctness, not just syntax.
          3. If the solution is incorrect or incomplete, explain why.
          4. Provide clear, actionable tips to fix or improve the code.
          5. Assume the code is run in a standard environment for the given language.
          6. Do NOT rewrite the full solution unless absolutely necessary.

        IMPORTANT OUTPUT LANGUAGE RULE:
          - "feedback" and all entries in "tips" MUST be written in Dutch.

        REQUIRED OUTPUT FORMAT (JSON ONLY):
        {
          "isCorrect": boolean,
          "feedback": string,
          "tips": string[]
        }
      `,
    });
  }
}
