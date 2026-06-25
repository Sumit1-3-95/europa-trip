// ============================================================
// EUROPA FAMILY TRIP — MASTER DATA FILE
// Trip: 24 July – 14 August 2026
// Travellers: Sumit, Aishwarya, Mira, Dinesh, Chermanywati
// ============================================================

export type Country = "Sweden" | "Denmark" | "Netherlands" | "Belgium" | "India";

export type TransportType = "flight" | "train" | "ferry" | "bus" | "taxi" | "tram" | "water-bus";

export type AlertSeverity = "warning" | "info" | "success";

export interface Alert {
  severity: AlertSeverity;
  message: string;
}

export interface Transport {
  type: TransportType;
  from: string;
  to: string;
  departureTime?: string;        // "HH:MM"
  arrivalTime?: string;          // "HH:MM"
  operator?: string;
  flightNumber?: string;
  trainNumber?: string;
  bookingRef?: string;
  carriage?: string;
  duration?: string;             // human-readable e.g. "4h 34m"
  via?: string;
  notes?: string;
}

export interface Activity {
  time?: string;                 // "HH:MM" or "Morning" / "Afternoon" / "Evening"
  title: string;
  description: string;
  kidFriendly?: boolean;
  elderlyFriendly?: boolean;
  ticketRequired?: boolean;
  ticketBooked?: boolean;
  ticketUrl?: string;
}

export interface DayPlan {
  day: number;                   // 1–22
  date: string;                  // "YYYY-MM-DD"
  dateLabel: string;             // "Fri 24 Jul"
  city: string;
  country: Country;
  countryCode: "SE" | "DK" | "NL" | "BE" | "IN";
  stayId: string;                // references Stay.id
  isTravelDay: boolean;
  transport?: Transport[];
  activities: Activity[];
  alerts?: Alert[];
  checklistItems?: string[];     // default daily checklist items
  notes?: string;
}

export interface Stay {
  id: string;
  name: string;
  type: "family-home" | "airbnb";
  address: string;
  city: string;
  country: Country;
  host?: string;
  checkIn: string;               // "YYYY-MM-DD"
  checkOut: string;              // "YYYY-MM-DD"
  checkInTime?: string;          // "after HH:MM"
  checkOutTime?: string;         // "before HH:MM"
  nights: number;
  airbnbRef?: string;
  coordinates?: { lat: number; lng: number };
  alerts?: Alert[];
  notes?: string;
}

export interface FlightBooking {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;                  // "YYYY-MM-DD"
  departureTime: string;
  arrivalTime: string;
  operator: string;
  flightNumbers: string[];
  bookingRef: string;
  via?: string;
  viaCode?: string;
  passengers: string[];
  notes?: string;
}

export interface TrainBooking {
  id: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  operator: string;
  trainNumber: string;
  bookingRef: string;
  carriage?: string;
  passengers: string[];
  notes?: string;
}

export interface EmergencyContact {
  country: Country;
  countryCode: string;
  police: string;
  ambulance: string;
  indianEmbassy?: string;
  indianEmbassyAddress?: string;
  localEmergency: string;        // single unified number if available
  notes?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: "adult" | "child" | "senior";
  phone?: string;
  passportNumber?: string;
}

// ============================================================
// FAMILY MEMBERS
// ============================================================

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: "sumit", name: "Sumit Sharma", role: "adult", phone: "+91 99717 52725", passportNumber: "S1432575" },
  { id: "aishwarya", name: "Aishwarya Parashar", role: "adult" },
  { id: "mira", name: "Mira Sharma", role: "child" },
  { id: "dinesh", name: "Dinesh Kumar", role: "senior" },
  { id: "chermanywati", name: "Chermanywati Sharma", role: "senior" },
  { id: "komal", name: "Komal Sharma", role: "adult" },  // sister in Solna
];

// ============================================================
// FLIGHT BOOKINGS
// ============================================================

export const FLIGHT_BOOKINGS: FlightBooking[] = [
  {
    id: "flight-del-arn",
    from: "New Delhi",
    fromCode: "DEL",
    to: "Stockholm Arlanda",
    toCode: "ARN",
    date: "2026-07-24",
    departureTime: "06:00",      // approximate — confirm on Lufthansa app
    arrivalTime: "14:25",
    operator: "Lufthansa",
    flightNumbers: ["LH761", "LH2420"],
    bookingRef: "9XUWK9",
    via: "Munich",
    viaCode: "MUC",
    passengers: ["sumit", "aishwarya", "mira", "dinesh", "chermanywati"],
    notes: "Arrive Arlanda Terminal 5. Komal collecting from airport.",
  },
  {
    id: "flight-cph-ams",
    from: "Copenhagen",
    fromCode: "CPH",
    to: "Amsterdam",
    toCode: "AMS",
    date: "2026-08-02",
    departureTime: "08:10",
    arrivalTime: "09:35",
    operator: "Norwegian",
    flightNumbers: ["D83538"],
    bookingRef: "XVDUPJ",
    passengers: ["sumit", "aishwarya", "mira", "dinesh", "chermanywati"],
    notes: "Early flight. Leave Malmö Airbnb by 05:30am. CPH airport by 06:30am. Train Hyllie → CPH Airport ~40 min.",
  },
  {
    id: "flight-bru-arn",
    from: "Brussels",
    fromCode: "BRU",
    to: "Stockholm Arlanda",
    toCode: "ARN",
    date: "2026-08-11",
    departureTime: "18:55",
    arrivalTime: "21:05",
    operator: "SAS",
    flightNumbers: ["SK1590"],
    bookingRef: "YJI224",
    passengers: ["sumit", "aishwarya", "mira", "dinesh", "chermanywati"],
    notes: "Leave Sint-Pieters-Leeuw Airbnb by 16:30. BRU airport ~30 min taxi. Latest check-in 18:10.",
  },
  {
    id: "flight-arn-del",
    from: "Stockholm Arlanda",
    fromCode: "ARN",
    to: "New Delhi",
    toCode: "DEL",
    date: "2026-08-14",
    departureTime: "06:00",
    arrivalTime: "23:55",
    operator: "Lufthansa",
    flightNumbers: ["LH2421", "LH762"],
    bookingRef: "9XUWK9",
    via: "Munich",
    viaCode: "MUC",
    passengers: ["sumit", "aishwarya", "mira", "dinesh", "chermanywati"],
    notes: "Leave Solna at 3:00am. Arlanda Terminal 5 by 3:45am. Very early — pack night before.",
  },
];

// ============================================================
// TRAIN BOOKINGS
// ============================================================

export const TRAIN_BOOKINGS: TrainBooking[] = [
  {
    id: "train-sto-mal",
    from: "Stockholm Central",
    to: "Malmö Central",
    date: "2026-07-30",
    departureTime: "07:19",
    arrivalTime: "11:53",
    operator: "SJ",
    trainNumber: "523",
    bookingRef: "W5UNRLKY",
    carriage: "7",
    passengers: ["sumit", "aishwarya", "mira", "dinesh", "chermanywati"],
    notes: "SJ X2000 high-speed train. Carriage 7. Direct. Arrive in time for afternoon at Malmöhus Castle.",
  },
];

// ============================================================
// STAYS
// ============================================================

export const STAYS: Stay[] = [
  {
    id: "stay-solna-outbound",
    name: "Komal's home",
    type: "family-home",
    address: "Solna, Stockholm",
    city: "Solna",
    country: "Sweden",
    checkIn: "2026-07-24",
    checkOut: "2026-07-30",
    nights: 6,
    notes: "Base for first week. Komal (sister) hosting.",
  },
  {
    id: "stay-malmo",
    name: "House in Malmö",
    type: "airbnb",
    address: "Hyllie kyrkoväg 48, Malmö",
    city: "Malmö",
    country: "Sweden",
    host: "Julia",
    checkIn: "2026-07-30",
    checkOut: "2026-08-02",
    checkInTime: "after 16:00",
    checkOutTime: "before 10:00",
    nights: 3,
    coordinates: { lat: 55.5587, lng: 12.9734 },
    alerts: [
      {
        severity: "warning",
        message: "CPH flight departs 08:10 on Aug 2. Must leave Airbnb by 05:30am. Train Hyllie → CPH Airport takes ~40 min. Arrange early bag drop with host Julia.",
      },
    ],
    notes: "Near Hyllie station — excellent for Øresund bridge commute to Copenhagen and for CPH airport.",
  },
  {
    id: "stay-sprang-capelle",
    name: "House in Sprang-Capelle",
    type: "airbnb",
    address: "Dijkstraat 12, Sprang-Capelle",
    city: "Sprang-Capelle",
    country: "Netherlands",
    host: "Sonny",
    checkIn: "2026-08-02",
    checkOut: "2026-08-04",
    checkInTime: "after 15:00",
    checkOutTime: "before 10:00",
    nights: 2,
    coordinates: { lat: 51.6614, lng: 5.0142 },
    alerts: [
      {
        severity: "info",
        message: "~20 min from Efteling theme park. Book Efteling summer tickets in advance at efteling.com — normal tickets invalid in August. Budget ~€38–53/person.",
      },
    ],
    notes: "Perfect base for Efteling day. Buitenhuis property.",
  },
  {
    id: "stay-rotterdam",
    name: "Townhouse in Rotterdam",
    type: "airbnb",
    address: "Van Brakelstraat 107, Rotterdam",
    city: "Rotterdam",
    country: "Netherlands",
    host: "Alexander",
    checkIn: "2026-08-04",
    checkOut: "2026-08-06",
    checkInTime: "after 15:00",
    checkOutTime: "before 11:00",
    nights: 2,
    coordinates: { lat: 51.9225, lng: 4.4792 },
    notes: "Central Rotterdam. Kinderdijk 30 min by water bus. Den Haag 25 min by train.",
  },
  {
    id: "stay-ostend",
    name: "Flat in Ostend",
    type: "airbnb",
    address: "Mijnplein 6A, Ostend",
    city: "Ostend",
    country: "Belgium",
    host: "Peter",
    checkIn: "2026-08-06",
    checkOut: "2026-08-09",
    checkInTime: "after 16:00",
    checkOutTime: "before 11:00",
    nights: 3,
    coordinates: { lat: 51.2288, lng: 2.9183 },
    notes: "Bruges 15 min by train (every 30 min). Ghent 35 min. Beach right in town.",
  },
  {
    id: "stay-sint-pieters-leeuw",
    name: "House in Sint-Pieters-Leeuw",
    type: "airbnb",
    address: "Vlierstraat 14, Sint-Pieters-Leeuw",
    city: "Sint-Pieters-Leeuw",
    country: "Belgium",
    host: "Elke",
    checkIn: "2026-08-09",
    checkOut: "2026-08-11",
    checkInTime: "after 16:00",
    checkOutTime: "before 11:00",
    nights: 2,
    coordinates: { lat: 50.7698, lng: 4.2569 },
    alerts: [
      {
        severity: "warning",
        message: "Flight BRU→ARN departs 18:55 on Aug 11. Leave Airbnb by 16:30. BRU airport ~30 min by taxi.",
      },
    ],
    notes: "Brussels suburb, ~15km from city centre. ~20 min train to Brussels. ~30 min taxi to BRU airport.",
  },
  {
    id: "stay-solna-return",
    name: "Komal's home (return)",
    type: "family-home",
    address: "Solna, Stockholm",
    city: "Solna",
    country: "Sweden",
    checkIn: "2026-08-11",
    checkOut: "2026-08-14",
    nights: 3,
    alerts: [
      {
        severity: "warning",
        message: "Final departure Aug 14 at 06:00am. Leave Solna at 3:00am. Arlanda Terminal 5 by 3:45am. Pack on Aug 13 evening.",
      },
    ],
    notes: "Rest and recovery before long flight home. Farewell dinner with Komal on Aug 13.",
  },
];

// ============================================================
// DAILY ITINERARY
// ============================================================

export const DAYS: DayPlan[] = [
  // ── DAY 1 ──────────────────────────────────────────────────
  {
    day: 1,
    date: "2026-07-24",
    dateLabel: "Fri 24 Jul",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-outbound",
    isTravelDay: true,
    transport: [
      {
        type: "flight",
        from: "New Delhi (DEL)",
        to: "Stockholm Arlanda (ARN)",
        arrivalTime: "14:25",
        operator: "Lufthansa",
        flightNumber: "LH761 / LH2420",
        bookingRef: "9XUWK9",
        via: "Munich (MUC)",
        notes: "Arrive Terminal 5. Komal collecting.",
      },
    ],
    activities: [
      {
        time: "14:25",
        title: "Arrive Stockholm Arlanda",
        description: "Collect luggage, clear immigration. Komal picks up from Terminal 5.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
      {
        time: "Evening",
        title: "Rest at Komal's",
        description: "Settle in at Solna. Easy home-cooked dinner. Long journey day — no sightseeing.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
    ],
    alerts: [
      { severity: "info", message: "Long travel day. Prioritise rest. Arlanda to Solna is ~40 min by car." },
    ],
    checklistItems: ["Pick up all luggage", "Immigration / passport control", "Currency exchange if needed", "Activate roaming / buy SIM"],
  },

  // ── DAY 2 ──────────────────────────────────────────────────
  {
    day: 2,
    date: "2026-07-25",
    dateLabel: "Sat 25 Jul",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-outbound",
    isTravelDay: false,
    activities: [
      {
        time: "Morning",
        title: "Djurgården loop",
        description: "Relaxed walk on Djurgården island. Flat terrain — ideal for grandparents and Mira. Shoreline walk along the water.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Rosendals Trädgård",
        description: "Beautiful biodynamic garden with café. Pick-your-own flowers, café lunch in the greenhouse. Peaceful and unhurried.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
    ],
    notes: "Gentle first full day. Let everyone find their feet.",
  },

  // ── DAY 3 ──────────────────────────────────────────────────
  {
    day: 3,
    date: "2026-07-26",
    dateLabel: "Sun 26 Jul",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-outbound",
    isTravelDay: false,
    activities: [
      {
        time: "Morning",
        title: "Gamla Stan — Old Town",
        description: "Cobblestone streets of Stockholm's medieval old town. Very compact and walkable.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Morning",
        title: "Nobel Museum",
        description: "Interactive museum on the Nobel Prize. Interesting for all ages.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Stortorget square + fika",
        description: "Oldest square in Stockholm. Stop at a café for traditional Swedish fika — coffee and cinnamon bun.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
    ],
  },

  // ── DAY 4 ──────────────────────────────────────────────────
  {
    day: 4,
    date: "2026-07-27",
    dateLabel: "Mon 27 Jul",
    city: "Vaxholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-outbound",
    isTravelDay: false,
    transport: [
      {
        type: "ferry",
        from: "Stockholm city",
        to: "Vaxholm",
        notes: "Waxholmsbolaget ferry from Strömkajen. ~1 hour each way. Scenic archipelago route.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Ferry to Vaxholm",
        description: "Scenic archipelago ferry — one of the most beautiful short journeys around Stockholm.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Vaxholm island",
        description: "Swimming, picnic by the water. Explore the small harbour town. Vaxholm Fortress visible from the waterfront.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
    ],
    notes: "One of the most scenic days. Pack picnic or buy lunch on the island.",
  },

  // ── DAY 5 ──────────────────────────────────────────────────
  {
    day: 5,
    date: "2026-07-28",
    dateLabel: "Tue 28 Jul",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-outbound",
    isTravelDay: false,
    activities: [
      {
        time: "Morning",
        title: "Skansen open-air museum + zoo",
        description: "World's oldest open-air museum. Historic Swedish buildings, Nordic animals (moose, reindeer, bears). Great for all ages.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Junibacken children's museum",
        description: "Pippi Longstocking themed museum — magical for young children. Story Train ride through classic Astrid Lindgren tales.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
    ],
    notes: "Both Skansen and Junibacken are on Djurgården — easy walking distance between them.",
  },

  // ── DAY 6 ──────────────────────────────────────────────────
  {
    day: 6,
    date: "2026-07-29",
    dateLabel: "Wed 29 Jul",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-outbound",
    isTravelDay: false,
    transport: [
      {
        type: "ferry",
        from: "Stadshusbron",
        to: "Drottningholm",
        notes: "Or take bus 176/177. Ferry is more scenic.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Drottningholm Palace",
        description: "UNESCO World Heritage royal palace and gardens. One of the best-preserved 17th century royal palaces in Europe.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Palace gardens walk",
        description: "Beautiful formal baroque gardens and the Chinese Pavilion. Flat and easy walking.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
    ],
    notes: "Last full day in Stockholm. Pack bags this evening for early train tomorrow.",
    alerts: [
      { severity: "warning", message: "Train to Malmö departs 07:19 tomorrow (Thu 30 Jul). Pack tonight. Set early alarm." },
    ],
  },

  // ── DAY 7 ──────────────────────────────────────────────────
  {
    day: 7,
    date: "2026-07-30",
    dateLabel: "Thu 30 Jul",
    city: "Malmö",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-malmo",
    isTravelDay: true,
    transport: [
      {
        type: "train",
        from: "Stockholm Central",
        to: "Malmö Central",
        departureTime: "07:19",
        arrivalTime: "11:53",
        operator: "SJ",
        trainNumber: "523",
        bookingRef: "W5UNRLKY",
        carriage: "7",
        duration: "4h 34m",
        notes: "SJ X2000 high-speed. Carriage 7.",
      },
    ],
    activities: [
      {
        time: "07:19",
        title: "Train departs Stockholm Central",
        description: "SJ X2000 to Malmö. 4h 34m direct. Carriage 7.",
      },
      {
        time: "11:53",
        title: "Arrive Malmö Central",
        description: "Drop bags, grab lunch near the station.",
      },
      {
        time: "Afternoon",
        title: "Malmöhus Castle",
        description: "Scandinavia's oldest Renaissance castle. City museum, aquarium, and art museum all inside. Easy to navigate for elderly and kids.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "After 16:00",
        title: "Check in at Airbnb",
        description: "Hyllie kyrkoväg 48. Host: Julia. Check-in after 4pm.",
      },
    ],
    alerts: [
      { severity: "info", message: "Check-in not before 16:00. Use luggage storage at Malmö Central if arriving early." },
    ],
  },

  // ── DAY 8 ──────────────────────────────────────────────────
  {
    day: 8,
    date: "2026-07-31",
    dateLabel: "Fri 31 Jul",
    city: "Malmö",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-malmo",
    isTravelDay: false,
    activities: [
      {
        time: "Morning",
        title: "Folkets Park",
        description: "Europe's oldest people's park. Playground, Cool Minds science centre, Reptile Centre. Perfect for Mira and grandparents.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Ribersborg Beach",
        description: "Long sandy beach in the city. Ribersborg Kallbadhus (cold bath house) on jetty. Easy flat walk.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Turning Torso walk",
        description: "Walk along the Western Harbour waterfront past Malmö's iconic twisting tower. Scenic promenade.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
    ],
  },

  // ── DAY 9 ──────────────────────────────────────────────────
  {
    day: 9,
    date: "2026-08-01",
    dateLabel: "Sat 1 Aug",
    city: "Copenhagen (day trip)",
    country: "Denmark",
    countryCode: "DK",
    stayId: "stay-malmo",
    isTravelDay: false,
    transport: [
      {
        type: "train",
        from: "Malmö Central",
        to: "Copenhagen Central",
        duration: "35 min",
        notes: "Øresund train across the bridge. Runs every 20 min. Buy Öresundtåg ticket.",
      },
      {
        type: "train",
        from: "Copenhagen Central",
        to: "Malmö Central",
        notes: "Return train in the evening. Last trains run past midnight.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Train to Copenhagen",
        description: "35 min Øresund train from Malmö. Cross the iconic Øresund bridge.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
      {
        time: "Morning",
        title: "Rosenborg Castle + King's Garden",
        description: "17th century castle housing the Danish crown jewels. Beautiful surrounding park for picnic or rest.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Nyhavn waterfront",
        description: "Copenhagen's iconic colourful canal. Great for lunch, photos, and a short canal boat tour.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Evening",
        title: "Return train to Malmö",
        description: "Head back to Malmö for dinner and rest. Early start tomorrow.",
        elderlyFriendly: true,
      },
    ],
    alerts: [
      { severity: "warning", message: "VERY EARLY flight tomorrow (Sun 2 Aug). CPH departs 08:10. Must leave Malmö Airbnb by 05:30am. Back from Copenhagen early this evening — rest is key." },
    ],
    notes: "Return to Malmö Airbnb for sleep. Early wake-up tomorrow is critical.",
  },

  // ── DAY 10 ──────────────────────────────────────────────────
  {
    day: 10,
    date: "2026-08-02",
    dateLabel: "Sun 2 Aug",
    city: "Amsterdam → Sprang-Capelle",
    country: "Netherlands",
    countryCode: "NL",
    stayId: "stay-sprang-capelle",
    isTravelDay: true,
    transport: [
      {
        type: "train",
        from: "Malmö (Hyllie station)",
        to: "Copenhagen Airport (CPH)",
        departureTime: "05:30",
        duration: "~40 min",
        notes: "Leave Airbnb by 05:30. Train from Hyllie to CPH Airport.",
      },
      {
        type: "flight",
        from: "Copenhagen (CPH)",
        to: "Amsterdam (AMS)",
        departureTime: "08:10",
        arrivalTime: "09:35",
        operator: "Norwegian",
        flightNumber: "D83538",
        bookingRef: "XVDUPJ",
        duration: "1h 25m",
      },
      {
        type: "train",
        from: "Amsterdam Centraal",
        to: "Sprang-Capelle",
        duration: "~1h 30m",
        notes: "Train Amsterdam → Tilburg or 's-Hertogenbosch, then taxi/bus to Dijkstraat 12.",
      },
    ],
    activities: [
      {
        time: "05:30",
        title: "Leave Malmö Airbnb",
        description: "Early departure. All bags packed night before. Train from Hyllie to CPH Airport (~40 min).",
      },
      {
        time: "06:30",
        title: "At Copenhagen Airport",
        description: "Check in, security, departure gate. Norwegian terminal.",
      },
      {
        time: "09:35",
        title: "Arrive Amsterdam",
        description: "Collect bags, take train from Schiphol to Sprang-Capelle area (~1.5 hrs).",
      },
      {
        time: "After 15:00",
        title: "Check in Sprang-Capelle",
        description: "Dijkstraat 12. Host: Sonny. Rest — big travel day. Efteling tomorrow!",
      },
    ],
    alerts: [
      { severity: "warning", message: "05:30am departure from Malmö. This is the earliest start of the trip. Pack everything the night before." },
      { severity: "info", message: "Check-in at Sprang-Capelle is from 15:00. May need to wait if arriving before." },
    ],
  },

  // ── DAY 11 ──────────────────────────────────────────────────
  {
    day: 11,
    date: "2026-08-03",
    dateLabel: "Mon 3 Aug",
    city: "Efteling",
    country: "Netherlands",
    countryCode: "NL",
    stayId: "stay-sprang-capelle",
    isTravelDay: false,
    transport: [
      {
        type: "taxi",
        from: "Sprang-Capelle Airbnb",
        to: "Efteling Theme Park",
        duration: "~20 min",
        notes: "Or drive if renting a car. Kaatsheuvel village.",
      },
    ],
    activities: [
      {
        time: "10:00",
        title: "Efteling opens",
        description: "Europe's largest fairytale theme park. Open ~10am to 8pm in August. Full day here.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
        ticketBooked: false,
        ticketUrl: "https://www.efteling.com",
      },
      {
        time: "Morning",
        title: "Fairytale Forest",
        description: "Enchanted woodland walk through fairy tale scenes — perfect for Mira and grandparents. Slow-paced, beautiful.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Gondoletta + Baron 1898",
        description: "Gondoletta: peaceful boat ride around the lake. Baron 1898: roller coaster for the adults/teens.",
        kidFriendly: true,
      },
      {
        time: "Evening",
        title: "Aquanura water show",
        description: "Spectacular lake fountain show with fire and light. One of the best shows in any European theme park.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
    ],
    alerts: [
      { severity: "warning", message: "Summer tickets MUST be booked in advance at efteling.com. Normal tickets are not valid in August. Budget ~€38–53/person (×5 = ~€190–265 total)." },
    ],
  },

  // ── DAY 12 ──────────────────────────────────────────────────
  {
    day: 12,
    date: "2026-08-04",
    dateLabel: "Tue 4 Aug",
    city: "Rotterdam",
    country: "Netherlands",
    countryCode: "NL",
    stayId: "stay-rotterdam",
    isTravelDay: true,
    transport: [
      {
        type: "train",
        from: "Sprang-Capelle area",
        to: "Rotterdam Centraal",
        duration: "~45 min",
        notes: "Check out by 10am. Train from nearby station.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Check out Sprang-Capelle",
        description: "Check out by 10:00. Head to station for Rotterdam.",
      },
      {
        time: "Afternoon",
        title: "Markthal",
        description: "Rotterdam's spectacular indoor market hall — horseshoe-shaped arch covered in giant food mural artwork. Great for lunch.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Cube Houses (Kubuswoningen)",
        description: "Rotterdam's iconic yellow cube houses. One is open as a museum. Just outside Markthal.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Evening",
        title: "Maas riverfront walk",
        description: "Walk along the river. Erasmus Bridge view. Great for photos at sunset.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
    ],
  },

  // ── DAY 13 ──────────────────────────────────────────────────
  {
    day: 13,
    date: "2026-08-05",
    dateLabel: "Wed 5 Aug",
    city: "Rotterdam + Den Haag",
    country: "Netherlands",
    countryCode: "NL",
    stayId: "stay-rotterdam",
    isTravelDay: false,
    transport: [
      {
        type: "water-bus",
        from: "Rotterdam",
        to: "Kinderdijk",
        duration: "30 min",
        operator: "Waterbus",
        notes: "Departs from Erasmus Bridge area. Return by water bus or bus.",
      },
      {
        type: "train",
        from: "Rotterdam Centraal",
        to: "Den Haag Centraal",
        duration: "25 min",
        notes: "Direct Intercity. Very frequent.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Kinderdijk windmills",
        description: "UNESCO-listed 18th century windmill network. 19 windmills along flat canal path. Perfectly accessible for grandparents. Iconic Netherlands experience.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Train to Den Haag",
        description: "25 min from Rotterdam. Head to Madurodam.",
      },
      {
        time: "Afternoon",
        title: "Madurodam",
        description: "1:25 scale miniature replica of the entire Netherlands — airports, windmills, canals, cities. Mira will love this. Very easy for grandparents.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
    ],
    notes: "One of the best days of the Netherlands section — iconic Dutch experiences back to back.",
  },

  // ── DAY 14 ──────────────────────────────────────────────────
  {
    day: 14,
    date: "2026-08-06",
    dateLabel: "Thu 6 Aug",
    city: "Den Haag → Ostend",
    country: "Belgium",
    countryCode: "BE",
    stayId: "stay-ostend",
    isTravelDay: true,
    transport: [
      {
        type: "train",
        from: "Rotterdam",
        to: "Den Haag Centraal",
        duration: "25 min",
        notes: "Check out Rotterdam by 11am. Head to Den Haag for morning.",
      },
      {
        type: "train",
        from: "Den Haag Centraal",
        to: "Ostend",
        duration: "~2h 30m",
        notes: "Afternoon train to Ostend. May require 1 change.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Check out Rotterdam",
        description: "Check out Van Brakelstraat by 11am. Bags to station.",
      },
      {
        time: "Morning",
        title: "Scheveningen beach",
        description: "15 min tram from Den Haag Centraal. Long sandy beach on the North Sea. Flat promenade — easy for grandparents.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
      {
        time: "Midday",
        title: "Mauritshuis museum (optional)",
        description: "World-class art museum — home of Vermeer's Girl with a Pearl Earring. Small and manageable. Only if energy allows.",
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Train to Ostend",
        description: "~2.5 hr train to Ostend, Belgium. Check in after 4pm at Mijnplein 6A.",
      },
    ],
  },

  // ── DAY 15 ──────────────────────────────────────────────────
  {
    day: 15,
    date: "2026-08-07",
    dateLabel: "Fri 7 Aug",
    city: "Bruges (day trip from Ostend)",
    country: "Belgium",
    countryCode: "BE",
    stayId: "stay-ostend",
    isTravelDay: false,
    transport: [
      {
        type: "train",
        from: "Ostend",
        to: "Bruges",
        duration: "15 min",
        notes: "Direct train every 30 minutes from Ostend station.",
      },
      {
        type: "train",
        from: "Bruges",
        to: "Ostend",
        duration: "15 min",
        notes: "Return any time — last trains run late.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Train to Bruges",
        description: "15 min direct from Ostend — incredibly convenient base.",
      },
      {
        time: "Morning",
        title: "Canal boat tour",
        description: "Seated 30-minute canal boat tour of medieval Bruges. Perfect for grandparents — no walking required. Must-do experience.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Markt square + Belfry",
        description: "Bruges' main square. View the medieval Belfry tower (climb optional). Beautiful Gothic architecture.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Minnewater Lake",
        description: "The Lake of Love — peaceful swan-filled lake at the edge of the old city. Easy flat walk.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Chocolate shops",
        description: "Bruges is the chocolate capital of Belgium. Stop at artisan chocolatiers on Katelijnestraat or Simon Stevinplein.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
    ],
    notes: "One of the most beautiful medieval cities in Europe. Very walkable and flat in the centre.",
  },

  // ── DAY 16 ──────────────────────────────────────────────────
  {
    day: 16,
    date: "2026-08-08",
    dateLabel: "Sat 8 Aug",
    city: "Ostend",
    country: "Belgium",
    countryCode: "BE",
    stayId: "stay-ostend",
    isTravelDay: false,
    transport: [
      {
        type: "tram",
        from: "Ostend",
        to: "Coastal tramway",
        notes: "De Lijn Kusttram — world's longest tram line, runs the full Belgian coast.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Ostend beach",
        description: "Long sandy beach right in the city. Swim, build sandcastles, relax. Flat promenade — very easy for grandparents.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Morning",
        title: "Coastal tram ride",
        description: "Hop on the Kusttram — world's longest tram line. Short scenic ride up the coast and back.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Ostend old town",
        description: "Fish market at the harbour, local restaurants for North Sea shrimp and moules-frites. James Ensor House (artist museum).",
        elderlyFriendly: true,
        kidFriendly: true,
      },
    ],
    notes: "Rest and recharge day by the sea. Quietest day of the Belgium section.",
  },

  // ── DAY 17 ──────────────────────────────────────────────────
  {
    day: 17,
    date: "2026-08-09",
    dateLabel: "Sun 9 Aug",
    city: "Ghent → Sint-Pieters-Leeuw",
    country: "Belgium",
    countryCode: "BE",
    stayId: "stay-sint-pieters-leeuw",
    isTravelDay: true,
    transport: [
      {
        type: "train",
        from: "Ostend",
        to: "Ghent Sint-Pieters",
        duration: "35 min",
        notes: "Check out Ostend by 11am. Train to Ghent for morning visit.",
      },
      {
        type: "train",
        from: "Ghent Sint-Pieters",
        to: "Sint-Pieters-Leeuw",
        duration: "~1h",
        notes: "Afternoon train from Ghent to Sint-Pieters-Leeuw (via Brussels).",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Check out Ostend",
        description: "Check out Mijnplein 6A by 11am.",
      },
      {
        time: "Morning",
        title: "Ghent — Gravensteen Castle",
        description: "Medieval water castle in the heart of Ghent. Impressive interior with armour and torture instruments. Mira will love it.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Midday",
        title: "Graslei riverfront",
        description: "Ghent's most beautiful stretch — medieval guild houses along the canal. Canal boat tour available.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Train to Sint-Pieters-Leeuw",
        description: "Head to the Brussels suburb. Check in after 4pm at Vlierstraat 14, host: Elke.",
      },
    ],
  },

  // ── DAY 18 ──────────────────────────────────────────────────
  {
    day: 18,
    date: "2026-08-10",
    dateLabel: "Mon 10 Aug",
    city: "Brussels",
    country: "Belgium",
    countryCode: "BE",
    stayId: "stay-sint-pieters-leeuw",
    isTravelDay: false,
    transport: [
      {
        type: "train",
        from: "Sint-Pieters-Leeuw",
        to: "Brussels Midi / Centraal",
        duration: "~20 min",
        notes: "Frequent train service.",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Grand Place",
        description: "One of Europe's most magnificent squares. Gothic Town Hall, guild houses. Try a Belgian waffle from a street stall.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Morning",
        title: "Royal Gallery of Saint Hubert",
        description: "19th century glass-roofed arcade — elegant shopping gallery with chocolatiers, booksellers, cafés.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
      {
        time: "Afternoon",
        title: "Atomium",
        description: "Brussels' iconic 1958 World Expo structure. 9 interconnected spheres representing an iron atom. Panoramic views from the top.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Mini-Europe",
        description: "1:25 scale replicas of European monuments — next to Atomium. Mira will love spotting landmarks.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
    ],
    notes: "Full Brussels day. Pack light — train commute from Sint-Pieters-Leeuw is easy.",
  },

  // ── DAY 19 ──────────────────────────────────────────────────
  {
    day: 19,
    date: "2026-08-11",
    dateLabel: "Tue 11 Aug",
    city: "Brussels → Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-return",
    isTravelDay: true,
    transport: [
      {
        type: "taxi",
        from: "Sint-Pieters-Leeuw",
        to: "Brussels Airport (BRU)",
        duration: "~30 min",
        notes: "Pre-book taxi. Leave Airbnb by 16:30 latest.",
      },
      {
        type: "flight",
        from: "Brussels (BRU)",
        to: "Stockholm Arlanda (ARN)",
        departureTime: "18:55",
        arrivalTime: "21:05",
        operator: "SAS",
        flightNumber: "SK1590",
        bookingRef: "YJI224",
        duration: "2h 10m",
      },
    ],
    activities: [
      {
        time: "Morning",
        title: "Check out Sint-Pieters-Leeuw",
        description: "Check out Vlierstraat 14 by 11am.",
      },
      {
        time: "Morning",
        title: "Morning free in Brussels",
        description: "Optional: revisit Grand Place or grab Belgian waffles and chocolate for takeaway gifts.",
      },
      {
        time: "16:30",
        title: "Head to Brussels Airport",
        description: "Pre-booked taxi from Sint-Pieters-Leeuw. ~30 min. Latest check-in 18:10.",
      },
      {
        time: "18:55",
        title: "Fly Brussels → Stockholm",
        description: "SAS SK1590. Arrive Arlanda 21:05. Komal collecting.",
      },
      {
        time: "~23:00",
        title: "Arrive Solna",
        description: "Back at Komal's. Late night arrival.",
      },
    ],
    alerts: [
      { severity: "warning", message: "Leave Sint-Pieters-Leeuw by 16:30. Latest check-in 18:10. Pre-book taxi — don't rely on finding one last minute with 5 people and luggage." },
    ],
  },

  // ── DAY 20 ──────────────────────────────────────────────────
  {
    day: 20,
    date: "2026-08-12",
    dateLabel: "Wed 12 Aug",
    city: "Solna",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-return",
    isTravelDay: false,
    activities: [
      {
        time: "All day",
        title: "Full rest day",
        description: "No plans. Home-cooked food at Komal's. Recover from 3 weeks of travel. Sleep, relax, recharge.",
        elderlyFriendly: true,
        kidFriendly: true,
      },
    ],
    notes: "Do nothing day. The grandparents especially will need this.",
  },

  // ── DAY 21 ──────────────────────────────────────────────────
  {
    day: 21,
    date: "2026-08-13",
    dateLabel: "Thu 13 Aug",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    stayId: "stay-solna-return",
    isTravelDay: false,
    activities: [
      {
        time: "Morning",
        title: "Optional: Kolmården wildlife park",
        description: "Scandinavia's largest zoo and wildlife park, 1.5 hr train north of Stockholm. Or stay in the city for a gentle day.",
        kidFriendly: true,
        elderlyFriendly: true,
        ticketRequired: true,
      },
      {
        time: "Afternoon",
        title: "Östermalm food hall (optional)",
        description: "Beautiful 1888 food hall — pick up last-minute Swedish gifts (lingonberry jam, snus-free snacks, Swedish candy).",
        elderlyFriendly: true,
      },
      {
        time: "Evening",
        title: "Farewell dinner with Komal",
        description: "Final evening together. Home dinner or restaurant — Komal's choice.",
        kidFriendly: true,
        elderlyFriendly: true,
      },
      {
        time: "Night",
        title: "Pack all bags",
        description: "Everything packed and ready. Early night — 3am wake-up tomorrow.",
      },
    ],
    alerts: [
      { severity: "warning", message: "Flight departs ARN at 06:00 tomorrow. Leave Solna at 3:00am. Set multiple alarms. Pack tonight — do not leave packing to the morning." },
    ],
  },

  // ── DEPARTURE DAY ──────────────────────────────────────────
  {
    day: 22,
    date: "2026-08-14",
    dateLabel: "Fri 14 Aug",
    city: "Delhi",
    country: "India",
    countryCode: "IN",
    stayId: "stay-solna-return",
    isTravelDay: true,
    transport: [
      {
        type: "flight",
        from: "Stockholm Arlanda (ARN)",
        to: "New Delhi (DEL)",
        departureTime: "06:00",
        arrivalTime: "23:55",
        operator: "Lufthansa",
        flightNumber: "LH2421 → LH762",
        bookingRef: "9XUWK9",
        via: "Munich (MUC)",
        duration: "~11h total",
      },
    ],
    activities: [
      {
        time: "03:00",
        title: "Leave Solna",
        description: "Car to Arlanda. ~40 min drive.",
      },
      {
        time: "03:45",
        title: "Arrive Arlanda Terminal 5",
        description: "Check in, drop bags, security.",
      },
      {
        time: "06:00",
        title: "Depart Stockholm",
        description: "LH2421 to Munich. Connection to LH762 Delhi.",
      },
      {
        time: "23:55",
        title: "Arrive New Delhi",
        description: "Home. Trip complete.",
      },
    ],
    alerts: [
      { severity: "warning", message: "3:00am departure from Solna. Arrange car/taxi the night before. Arlanda is 40 min away." },
    ],
  },
];

// ============================================================
// EMERGENCY CONTACTS
// ============================================================

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    country: "Sweden",
    countryCode: "SE",
    police: "114 14",
    ambulance: "112",
    localEmergency: "112",
    indianEmbassy: "+46 8 107 7000",
    indianEmbassyAddress: "Adolf Fredriks Kyrkogata 12, Stockholm",
    notes: "112 works for all emergencies in Sweden.",
  },
  {
    country: "Denmark",
    countryCode: "DK",
    police: "114",
    ambulance: "112",
    localEmergency: "112",
    indianEmbassy: "+45 3918 2888",
    indianEmbassyAddress: "Vangehusvej 15, Copenhagen",
    notes: "Visited as day trip from Malmö. 112 for all emergencies.",
  },
  {
    country: "Netherlands",
    countryCode: "NL",
    police: "0900-8844",
    ambulance: "112",
    localEmergency: "112",
    indianEmbassy: "+31 70 346 9771",
    indianEmbassyAddress: "Buitenrustweg 2, The Hague",
    notes: "112 for emergencies. Non-urgent police: 0900-8844.",
  },
  {
    country: "Belgium",
    countryCode: "BE",
    police: "101",
    ambulance: "100",
    localEmergency: "112",
    indianEmbassy: "+32 2 645 6900",
    indianEmbassyAddress: "Chaussée de Vleurgat 217, Brussels",
    notes: "112 works as European emergency number. Police: 101. Ambulance: 100.",
  },
];

// ============================================================
// CURRENCY INFO
// ============================================================

export const CURRENCIES = [
  { country: "Sweden", code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { country: "Denmark", code: "DKK", symbol: "kr", name: "Danish Krone" },
  { country: "Netherlands", code: "EUR", symbol: "€", name: "Euro" },
  { country: "Belgium", code: "EUR", symbol: "€", name: "Euro" },
  { country: "India", code: "INR", symbol: "₹", name: "Indian Rupee" },
];

// ============================================================
// LANGUAGE PHRASES
// ============================================================

export const LANGUAGE_PHRASES = [
  {
    language: "Swedish",
    countryCode: "SE",
    flag: "🇸🇪",
    phrases: [
      { english: "Hello", local: "Hej", pronunciation: "hey" },
      { english: "Thank you", local: "Tack", pronunciation: "tack" },
      { english: "Please", local: "Snälla", pronunciation: "snell-a" },
      { english: "Where is...?", local: "Var är...?", pronunciation: "var air" },
      { english: "How much?", local: "Hur mycket?", pronunciation: "hoor mick-et" },
      { english: "Excuse me", local: "Ursäkta", pronunciation: "oor-sek-ta" },
      { english: "Good morning", local: "God morgon", pronunciation: "good mor-on" },
      { english: "Cheers!", local: "Skål!", pronunciation: "skol" },
    ],
  },
  {
    language: "Danish",
    countryCode: "DK",
    flag: "🇩🇰",
    phrases: [
      { english: "Hello", local: "Hej", pronunciation: "hi" },
      { english: "Thank you", local: "Tak", pronunciation: "tack" },
      { english: "Please", local: "Vær så venlig", pronunciation: "vair so ven-lee" },
      { english: "Where is...?", local: "Hvor er...?", pronunciation: "vor air" },
      { english: "How much?", local: "Hvor meget?", pronunciation: "vor my-et" },
      { english: "Excuse me", local: "Undskyld", pronunciation: "oon-skool" },
      { english: "Good morning", local: "God morgen", pronunciation: "go mor-en" },
      { english: "Cheers!", local: "Skål!", pronunciation: "skol" },
    ],
  },
  {
    language: "Dutch",
    countryCode: "NL",
    flag: "🇳🇱",
    phrases: [
      { english: "Hello", local: "Hallo", pronunciation: "hah-low" },
      { english: "Thank you", local: "Dankjewel", pronunciation: "dank-yuh-vel" },
      { english: "Please", local: "Alsjeblieft", pronunciation: "als-yuh-bleeft" },
      { english: "Where is...?", local: "Waar is...?", pronunciation: "var is" },
      { english: "How much?", local: "Hoeveel?", pronunciation: "hoo-vale" },
      { english: "Excuse me", local: "Excuseer", pronunciation: "ex-coo-seer" },
      { english: "Good morning", local: "Goedemorgen", pronunciation: "khoo-duh-mor-khun" },
      { english: "Cheers!", local: "Proost!", pronunciation: "prohst" },
    ],
  },
  {
    language: "French",
    countryCode: "BE",
    flag: "🇧🇪",
    phrases: [
      { english: "Hello", local: "Bonjour", pronunciation: "bon-zhoor" },
      { english: "Thank you", local: "Merci", pronunciation: "mair-see" },
      { english: "Please", local: "S'il vous plaît", pronunciation: "sil voo play" },
      { english: "Where is...?", local: "Où est...?", pronunciation: "oo ay" },
      { english: "How much?", local: "Combien?", pronunciation: "com-bee-en" },
      { english: "Excuse me", local: "Excusez-moi", pronunciation: "ex-coo-zay mwa" },
      { english: "Good morning", local: "Bonjour", pronunciation: "bon-zhoor" },
      { english: "Cheers!", local: "Santé!", pronunciation: "son-tay" },
    ],
  },
];

// ============================================================
// PACKING CHECKLIST TEMPLATE
// ============================================================

export const PACKING_CATEGORIES = [
  {
    category: "Documents",
    items: [
      "Passports (all 5)",
      "Schengen visa printouts",
      "Flight booking confirmations",
      "Train booking (ref W5UNRLKY)",
      "All Airbnb booking confirmations",
      "Travel insurance certificates (all 5)",
      "Emergency contact card (printed)",
      "Driving licence (if renting car)",
      "Efteling tickets (once booked)",
    ],
  },
  {
    category: "Electronics",
    items: [
      "Phones + chargers (all members)",
      "Power banks",
      "Universal travel adaptor (Type F — EU)",
      "Camera + memory cards",
      "Earphones / headphones",
      "Tablet / laptop (if needed)",
      "Cables and charging bricks",
    ],
  },
  {
    category: "Clothing",
    items: [
      "Waterproof jacket (Scandinavia can be cool)",
      "Comfortable walking shoes (all members)",
      "Sandals / beach shoes",
      "Layers / light sweaters",
      "Sun hat for outdoor days",
      "Swimwear (Vaxholm, Ostend beach)",
      "Light formal for farewell dinner",
      "Socks and underwear (22 days)",
    ],
  },
  {
    category: "Toiletries & Health",
    items: [
      "Prescription medicines (full supply + extra)",
      "Travel first aid kit",
      "Sunscreen SPF 50",
      "Insect repellent",
      "Diarrhoea / stomach tablets",
      "Pain relief (paracetamol / ibuprofen)",
      "Motion sickness tablets (ferries)",
      "Hand sanitiser",
      "Toothbrushes and toothpaste",
      "Shampoo / conditioner (travel size)",
    ],
  },
  {
    category: "For Mira",
    items: [
      "Favourite toys / comfort items",
      "Activity books / colouring set",
      "Snacks for travel days",
      "Child pain relief medicine",
      "Wet wipes",
      "Change of clothes in hand luggage",
      "Carrier / pram if needed",
    ],
  },
  {
    category: "Grandparents",
    items: [
      "All regular medications (×22 days + spare)",
      "Doctor's letter for medications if required",
      "Comfortable walking shoes with support",
      "Walking stick / support aids if used",
      "Reading glasses + spare",
      "Warm layers",
    ],
  },
  {
    category: "Money & Payments",
    items: [
      "Credit / debit cards (Visa + Mastercard)",
      "Some cash in EUR (~€200)",
      "Some cash in SEK (~500 kr) for Sweden arrival",
      "Some cash in DKK (~200 kr) for Copenhagen",
      "Notify bank of travel dates",
    ],
  },
];

// ============================================================
// APP CONFIG
// ============================================================

export const TRIP_CONFIG = {
  tripName: "Europa Family Trip 2026",
  startDate: "2026-07-24",
  endDate: "2026-08-14",
  totalDays: 22,
  totalNights: 21,
  baseCurrency: "INR",
  countries: ["Sweden", "Denmark", "Netherlands", "Belgium"] as Country[],
  mainContact: {
    name: "Sumit Sharma",
    phone: "+91 99717 52725",
    email: "sumit.sharma.na08@gmail.com",
  },
  hostContact: {
    name: "Komal Sharma",
    location: "Solna, Stockholm, Sweden",
  },
};

