import { NextResponse } from "next/server";

const affirmations = [
  "You are enough, exactly as you are right now. 💙",
  "Every breath you take is a new beginning. You've survived 100% of your hardest days.",
  "Your feelings are valid. Your struggles are real. And so is your strength.",
  "You don't have to be perfect to deserve peace and happiness.",
  "Small steps forward are still steps forward. Be proud of yourself today.",
  "Healing is not linear. Every day you show up is a victory worth celebrating.",
  "You are worthy of love — especially from yourself.",
  "The storm inside you will pass. You have weathered every storm before this.",
  "Your sensitivity is not a weakness. It is the source of your deepest compassion.",
  "Today, choose one kind thought about yourself. You deserve your own kindness.",
  "You are growing, even when it doesn't feel like it.",
  "Rest is not surrender. Rest is preparation for the next step forward.",
  "In this moment, you are safe. In this moment, you are enough.",
  "Your presence in this world matters more than you know.",
  "Be gentle with yourself — you are doing the best you can.",
];

export async function GET() {
  const today = new Date();
  const index = today.getDate() % affirmations.length;
  return NextResponse.json({
    affirmation: affirmations[index],
    date: today.toISOString(),
  });
}
