module.exports = (req, res) => {
  res.status(200).json({
    total_students: 30,
    total_classes: 3,
    enrolled_per_class: {
      "Grade 11 - STEM": 10,
      "Grade 10 - ABM": 10,
      "Grade 12 - HUMSS": 10
    },
    present_today: 26,
    absent_today: 2,
    late_today: 2,
    avg_attendance_rate: "90.5%"
  });
};
