const checkTableExists = (
  db: any,
  table: string | undefined,
  isSQLite: string | undefined,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    let query: string;
    if (isSQLite === "YES") {
      query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`;
      db.all(query, (err: Error, rows: any[]) => {
        if (err) reject(err);
        resolve(rows.length > 0);
      });
    } else {
      query = `SELECT to_regclass('${table}')`;
      db.query(query, (err: Error, result: { rows: any[] }) => {
        if (err) reject(err);
        resolve(result.rows[0].to_regclass !== null);
      });
    }
  });
};

const fetchDataFromTable = async (
  db: any,
  table: string | undefined,
  isSQLite: string | undefined,
): Promise<any[]> => {
  let query: string;
  if (isSQLite === "YES") {
    query = `SELECT * FROM ${table}`;
    return new Promise((resolve, reject) => {
      db.all(query, (err: Error, rows: any[]) => {
        if (err) reject(err);
        if (
          rows.length > 0 &&
          Object.keys(rows[0]).some((key) => isNaN(Number(key)))
        ) {
          rows.shift();
        }
        resolve(rows);
      });
    });
  } else {
    query = `SELECT * FROM ${table}`;
    return new Promise((resolve, reject) => {
      db.query(query, (err: Error, result: { rows: any[] }) => {
        if (err) reject(err);
        resolve(result.rows);
      });
    });
  }
};

export const fetchData = async (
  db: any,
  table: string | undefined,
  isSQLite: string | undefined,
): Promise<{
  mainData: any[];
  columnsData: any[] | null;
  metadata: any[] | null;
}> => {
  console.log("Fetching data from", table, "...");
  // Fetch data
  const mainDataExists = await checkTableExists(db, table, isSQLite);
  let mainData = null;
  if (mainDataExists) {
    mainData = await fetchDataFromTable(db, table, isSQLite);
  } else {
    throw new Error("Main table does not exist");
  }

  // Fetch mapping columns
  const columnsTable = `${table}__columns`;
  const columnsTableExists = await checkTableExists(db, columnsTable, isSQLite);
  let columnsData = null;
  if (columnsTableExists) {
    columnsData = await fetchDataFromTable(db, columnsTable, isSQLite);
  }

  // Fetch metadata
  const metadataTable = `${table}__metadata`;
  const metadataTableExists = await checkTableExists(
    db,
    metadataTable,
    isSQLite,
  );
  let metadata = null;
  if (metadataTableExists) {
    metadata = await fetchDataFromTable(db, metadataTable, isSQLite);
  }

  console.log("Successfully fetched data from", table, "!");

  return { mainData, columnsData, metadata };
};

interface ViewConfig {
  VIEWS: string;
  ALERT_RESOURCES: string;
  EMBED_MEDIA: string;
  FILTER_BY_COLUMN: string;
  FILTER_OUT_VALUES_FROM_COLUMN: string;
  FRONT_END_FILTERING: string;
  FRONT_END_FILTER_COLUMN: string;
  MAPBOX_STYLE: string;
  MAPBOX_PROJECTION: string;
  MAPBOX_CENTER_LATITUDE: string;
  MAPBOX_CENTER_LONGITUDE: string;
  MAPBOX_ZOOM: string;
  MAPBOX_PITCH: string;
  MAPBOX_BEARING: string;
  MAPBOX_3D: string;
  MAPEO_TABLE: string;
  MAPEO_CATEGORY_IDS: string;
  MAP_LEGEND_LAYER_IDS: string;
  MEDIA_BASE_PATH: string;
  MEDIA_BASE_PATH_ALERTS: string;
  LOGO_URL: string;
  PLANET_API_KEY: string;
  UNWANTED_COLUMNS?: string;
  UNWANTED_SUBSTRINGS?: string;
}

interface Views {
  [key: string]: ViewConfig;
}

export const fetchViewsConfig = async (
  db: any,
  isSQLite: string | undefined,
): Promise<Views> => {
  const query = `SELECT * FROM config`;

  const result = await new Promise<any[]>((resolve, reject) => {
    if (isSQLite === "YES") {
      db.all(query, (err: Error, rows: any[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    } else {
      db.query(query, (err: Error, result: { rows: any[] }) => {
        if (err) reject(err);
        resolve(result.rows);
      });
    }
  });

  const viewsConfig: Views = {};
  result.forEach((row: any) => {
    viewsConfig[row.table_name] = row.config;
  });

  return viewsConfig;
};
