module.exports = () => {
  const filterStatus = [
    {
      label: "Tất cả",
      value: ""
    },
    {
      label: "Hoạt động",
      value: "active"
    },
    {
      label: "Dừng hoạt động",
      value: "inactive"
    },
  ];

  return filterStatus;
}