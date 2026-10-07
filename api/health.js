module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    project: 'Student Attendance Management System (SAMS)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
