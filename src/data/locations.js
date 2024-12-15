const locations = [
  {
    id: 1,
    name: "Al Shaheed Park",
    latitude: 29.372083,
    longitude: 47.991381,
    date: "2024-12-16", // Today
    startTime: "14:30",
    checkpoints: [
      {
        id: 1,
        name: "Checkpoint 1",
        latitude: 29.374015,
        longitude: 47.990214,
        points: 30,
        steps: 800,
        approx_distance: 0.64
      },
      {
        id: 2,
        name: "Checkpoint 2",
        latitude: 29.371978,
        longitude: 47.992401,
        points: 20,
        steps: 700,
        approx_distance: 0.56
      },
      {
        id: 3,
        name: "Checkpoint 3",
        latitude: 29.370989,
        longitude: 47.991873,
        points: 40,
        steps: 1773,
        approx_distance: 1.42
      }
    ],
    steps: 3273,
    approx_distance: 2.62
  },
  {
    id: 2,
    name: "Marina Crescent",
    latitude: 29.333756,
    longitude: 48.076109,
    date: "2024-01-21", // Tomorrow
    startTime: "09:00",
    checkpoints: [
      {
        id: 1,
        name: "Checkpoint 1",
        latitude: 29.332654,
        longitude: 48.075998,
        points: 15,
        steps: 1250,
        approx_distance: 1.0
      },
      {
        id: 2,
        name: "Checkpoint 2",
        latitude: 29.333901,
        longitude: 48.074212,
        points: 25,
        steps: 2100,
        approx_distance: 1.68
      },
      {
        id: 3,
        name: "Checkpoint 3",
        latitude: 29.334875,
        longitude: 48.076745,
        points: 35,
        steps: 2989,
        approx_distance: 2.39
      }
    ],
    steps: 6339,
    approx_distance: 5.07
  },
  {
    id: 3,
    name: "Green Island",
    latitude: 29.366791,
    longitude: 48.001479,
    date: "2024-02-03", // Future event
    startTime: "07:30",
    checkpoints: [
      {
        id: 1,
        name: "Checkpoint 1",
        latitude: 29.368295,
        longitude: 48.001962,
        points: 20,
        steps: 1850,
        approx_distance: 1.48
      },
      {
        id: 2,
        name: "Checkpoint 2",
        latitude: 29.365467,
        longitude: 48.002134,
        points: 30,
        steps: 2590,
        approx_distance: 2.07
      },
      {
        id: 3,
        name: "Checkpoint 3",
        latitude: 29.367052,
        longitude: 48.000657,
        points: 50,
        steps: 4215,
        approx_distance: 3.37
      },
      {
        id: 4,
        name: "Checkpoint 4",
        latitude: 29.368502,
        longitude: 48.001102,
        points: 40,
        steps: 1000,
        approx_distance: 0.8
      }
    ],
    steps: 9655,
    approx_distance: 7.72
  },
  {
    id: 4,
    name: "Scientific Center Walk",
    latitude: 29.349365,
    longitude: 48.089582,
    date: "2024-03-15", // Future event
    startTime: "08:00",
    checkpoints: [
      {
        id: 1,
        name: "Checkpoint 1",
        latitude: 29.348765,
        longitude: 48.090132,
        points: 25,
        steps: 950,
        approx_distance: 0.76
      },
      {
        id: 2,
        name: "Checkpoint 2",
        latitude: 29.349128,
        longitude: 48.088875,
        points: 15,
        steps: 1818,
        approx_distance: 1.45
      },
      {
        id: 3,
        name: "Checkpoint 3",
        latitude: 29.350041,
        longitude: 48.089174,
        points: 20,
        steps: 1000,
        approx_distance: 0.8
      }
    ],
    steps: 3768,
    approx_distance: 3.01
  },
  {
    id: 5,
    name: "Salmiya Seaside Walk",
    latitude: 29.340885,
    longitude: 48.078312,
    date: "2024-01-21", // Tomorrow
    startTime: "16:30",
    checkpoints: [
      {
        id: 1,
        name: "Checkpoint 1",
        latitude: 29.341275,
        longitude: 48.078112,
        points: 20,
        steps: 1200,
        approx_distance: 0.96
      },
      {
        id: 2,
        name: "Checkpoint 2",
        latitude: 29.340345,
        longitude: 48.078812,
        points: 25,
        steps: 1600,
        approx_distance: 1.28
      },
      {
        id: 3,
        name: "Checkpoint 3",
        latitude: 29.341015,
        longitude: 48.078612,
        points: 30,
        steps: 2000,
        approx_distance: 1.6
      }
    ],
    steps: 4800,
    approx_distance: 3.84
  }
];

export default locations;
  