export const download = (filename: string, data: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", filename);
  a.setAttribute("href", data);
  a.click();
};
