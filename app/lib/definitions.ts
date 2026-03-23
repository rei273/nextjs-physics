// This file contains type definitions for  data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

//import { z } from 'zod';
import { ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  google_id?: string;
  picture?: string;
};

export type TutorialsTable = {
  tutorial_id: string;
  slug: string;
  title: string;
  image_url: string;
  image_url_2: string;
  date: string;
  description: string;
  qslug: string;
};

export type Tutorial = {
  tutorial_id: string;
  slug: string;
  title: string;
  image_url: string;
  date: string;
  description: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
};

export type Question = {
  question_id: string;
  tutorial_id: string;
  type: string;
  question: string;
};

export type SurveyQuestion = {
  id: string;
  question_text: string;
  options: {
    id: string;
    option_text: string;
    created_at: string;
    question_id: string;
    survey_id?: string;
  }[]; // Adjust based on the actual structure of options
  created_at: string;
  survey_id?: string;
};

export type MyFormData = {
  [key: string]: string;
};

export type QuestionField = {
  question_id: string;
  question: string;
  type: string;
};

export type shortAnswer = {
  id: string;
  tutorial_id: string;
  question_id: string;
  question_slug: string;
  question: string;
  correct_answer: string;
};

export type optionAnswer = {
  id: string;
  tutorial_id: string;
  question_id: string;
  question_slug: string;
  question: string;
  option_text: string;
  is_correct: boolean;
};

export type Equipment = {
  id: string;
  tutorial_id: string;
  tutorial_slug: string;
  question_slug: string;
  equipment: string;
};

export type studentAnswer = {
  id: string;
  tutorial_id: string;
  question_id: string;
  tutorial_slug: string;
  question_slug: string;
  question: string;
  answer: string;
};

export type Option = {
  id: string;
  tutorial_id: string;
  option_text: string;
};

export type OptionField = {
  id: string;
  tutorial_id: string;
  option_text: string;
};

export type TutorialForm = {
  question: string;
  short_answer: string;
  multiple_choice_answer: string;
};

export type CorrectAnswer = {
  question_id: string;
  correct_answer: string;
};

export type TutorialImage = {
  image_name: string;
  image_url: string;
};

export type DiscussionQuestion = {
  id: string;
  username: string;
  subject: string;
  content: string;
  date: string;
};
export type State = {
  errors?: string | null;
  //message?: string | null; //message is optional (message?: string), which means it can be undefined or null or string.
  message: string;
  correctAnswers: CorrectAnswer[]; //the database query result type.
};

//validate signup form
import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  callbackUrl: z.string(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
  callbackUrl: z.string(),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export interface NeonDbError extends Error {
  code: string;
  detail: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: "auth_user_username_key";
}

export interface GoogleUser {
  sub: string;
  name: string;
  picture: string;
  email: string;
}

export type DiscussionFormState =
  | {
      errors?: {
        subject?: string[];
      };
      message?: string;
    }
  | undefined;

export const AskQuestionFormSchema = z.object({
  subject: z.string({ message: "please enter a subject" }),
  content: z.string({ message: "please enter your comments." }),
});

export const DiscussionReplyFormSchema = z.object({
  discussionId: z.string(),
  subject: z.string(),
  content: z.string({ message: "please enter your comments" }),
});

export type ContactFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        content?: string[];
      };
      message?: string;
    }
  | undefined;

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  content: z.string({ message: "please enter your message." }),
  callbackUrl: z.string(),
});

export type SurveyFormState =
  | {
      errors?: string | null;
      //message?: string | null; //message is optional (message?: string), which means it can be undefined or null or string.
      message?: string;
    }
  | undefined;

export interface SubMilestone {
  title: string;
  description?: string;
  status?: "Ready" | "Locked" | "Completed"; // Status for individual topics
}

export interface Milestone {
  title: string;
  description: string;
  //topics: string[];
  topics: SubMilestone[];
  activities: string[];
  positionX?: number; //position along the SVG path using SVG markers
  positionY?: number;
}

export interface stage {
  title: string;
  goals?: string;
  focus?: string;
  topics?: SubMilestone[];
  activities?: string[];
}
export interface AIContent {
  title: string;
  duration?: string;
  daily_commitment?: string;
  stages: stage[];
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};
//  export interface Milestone {
//     year: number;
//     title: string;
//     description: string;
//     positionX?: number; //position along the SVG path using SVG markers
//     positionY?: number
//   }
