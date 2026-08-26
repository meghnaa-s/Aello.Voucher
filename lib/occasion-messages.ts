export const OCCASION_MESSAGES: Record<string, string> = {
  "Happy Birthday":
    "Wishing you a beautiful birthday filled with movement, energy and a little time just for you.",
  "With Love": "A little time for yourself, movement for your body, and a moment to simply enjoy.",
  Congratulations: "A small celebration of you and everything you've worked so hard for.",
  "Just For You": "Because you deserve a quiet moment of movement, just for yourself.",
  "A Little Self-Care": "A gentle reminder to slow down, breathe, and make space for you.",
  "Happy Anniversary": "To many more beautiful moments, movement and time well spent together.",
};

export function defaultMessageFor(occasion: string): string {
  return OCCASION_MESSAGES[occasion] ?? "A little time for yourself, movement for your body, and a moment to simply enjoy.";
}
