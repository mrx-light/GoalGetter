export interface UserInterface {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isActive?: boolean;
}

export interface LeaguesInterface {
  country: {
    code: null | number | string;
    flag: null | string;
    name: string;
  };
  league: {
    id: number;
    logo: string | null;
    name: string;
    type: string;
  };
  seasons: {
    coverage: any;
    current: boolean | null;
    end: string | null;
    start: string | null;
    year: number;
  }[];
}

export interface TeamsInterface {
  team: {
    country: string;
    code: string;
    founded: number;
    name: string;
    logo: string;
    national: string;
    id: number;
  };
  venue: {
    image: string | null;
    address: string;
    surface: string;
    city: string;
    name: string;
    id: number;
    capacity: number;
  };
}

export interface CoachesInterface {
  age: number;
  birth: {
    country: string;
    date: string;
    place: string | null;
  };
  career: {
    end: string | null;
    start: string | null;
    team: {
      id: number;
      logo: string;
      name: string;
    }[];
  }[];
  firstname: string;
  height: string | number | null;
  id: number;
  lastname: string;
  name: string;
  nationality: string | null;
  photo: string;
  team: {
    id: number;
    logo: string;
    name: string;
  };
  weight: number | string | null;
}

export interface PlayerInterface {
  player: {
    age: number;
    birth: {
      date: string;
      place: string | null;
      country: string;
    };
    firstname: string;
    height: string | null;
    id: number;
    injured: boolean;
    lastname: string;
    name: string;
    nationality: string;
    photo: string | null;
    weight: string | number | null;
  };
  statistics: {
    cards: {
      yellow: number | null;
      yellowred: number | null;
      red: number | null;
    };
    dribbles: {
      attempts: null | number | string;
      success: null | number | string;
      past: null | number | string;
    };
    duel: {
      total: null | number | string;
      success: null | number | string;
      past: null | number | string;
    };
    fouls: {
      drown: null | number | string;
      committed: null | number | string;
    };
    games: {
      appearences: null | number | string;
      captain: boolean;
      lineups: number;
      minutes: number;
      number: number | null;
      position: string | null;
      rating: null | number | string;
    };
    goals: {
      total: number | null;
      conceded: string | null;
      assists: number | null;
      saves: null;
    };
    league: {
      country: string;
      flag: string | null;
      id: number;
      logo: string | null;
      name: string;
      season: string;
    };
    passes: {
      total: null | number | string;
      key: null | number | string;
      accuracy: null | number | string;
    };
    penalty: {
      commited: null | number | string;
      missed: null | number | string;
      saved: null | number | string;
      scored: null | number | string;
      won: null | number | string;
    };
    shots: {
      total: null | number | string;
      on: null | number | string;
    };
    substitutes: {
      in: null | number;
      out: null | number;
      bench: null | number;
    };
    tackles: {
      total: null | number;
      blocks: null | number;
      interceptions: null | number;
    };
    team: {
      id: number;
      name: string | null;
      logo: string | null;
    };
  }[];
}

export interface VenuesInterface {
  address: string | null;
  capacity: number | null;
  city: string;
  country: string;
  id: number;
  image: string | null;
  name: string;
  surface: string | null;
}
