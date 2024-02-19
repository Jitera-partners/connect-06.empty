export const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based
  const currentYear = currentDate.getFullYear();

  return {
    month: currentMonth,
    year: currentYear
  };
};
