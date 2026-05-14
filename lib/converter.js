export function hoursConverter(hoursParam) {
  const hours = Math.trunc(hoursParam);
  const minutes = Math.round((hoursParam % 1) * 60);
  return [hours, minutes];
}