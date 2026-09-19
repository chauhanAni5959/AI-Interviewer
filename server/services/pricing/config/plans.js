export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    coins: 100,
    amount: 15000,
    displayPrice: "Rs. 150",
    description: "A focused boost for your next interview.",
    featured: false,
  },
  {
    id: "growth",
    name: "Growth",
    coins: 200,
    amount: 25000,
    displayPrice: "Rs. 250",
    description: "More practice for a stronger interview rhythm.",
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    coins: 300,
    amount: 40000,
    displayPrice: "Rs. 400",
    description: "The best value for a serious preparation sprint.",
    featured: false,
  },
];

export const getPlan = (planId) => pricingPlans.find((plan) => plan.id === planId);
