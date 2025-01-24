const convertToKebabCase = (originalName) => {
  return originalName.split(' ').join('-').toLowerCase();
};

export default convertToKebabCase;
