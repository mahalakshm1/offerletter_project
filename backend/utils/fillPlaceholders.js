const fillPlaceholders = (content, candidate) => {
  return content
    .replace(/{{name}}/gi, candidate.name || '')
    .replace(/{{email}}/gi, candidate.email || '')
    .replace(/{{position}}/gi, candidate.position || '')
    .replace(/{{department}}/gi, candidate.department || '')
    .replace(/{{salary}}/gi, candidate.salary || '')
    .replace(/{{doj}}/gi, candidate.doj || '');
};

export default fillPlaceholders;
