import createHttpError from "http-errors";

export const validateDate = (from: string, to: string) => {
  let startDate: string | undefined;
  let endDate: string | undefined;

  if (from && to) {
    const isValidStartDate = !isNaN(new Date(from).getTime());
    const isValidEndDate = !isNaN(new Date(to).getTime());

    if (
      isValidStartDate &&
      isValidEndDate &&
      new Date(from).getTime() < new Date(to).getTime()
    ) {
      startDate = new Date(from).toLocaleDateString();
      endDate = new Date(to).toLocaleDateString();
    } else {
      throw createHttpError(400, "Invalid start or end date");
    }
  }

  return { startDate, endDate };
};
