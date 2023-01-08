export class Constants {
    public static cmsDBConnectionString2 = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.fmr2xrs.mongodb.net/cms`;
    public static cmsDBConnectionString = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.fmr2xrs.mongodb.net/cms?authSource=admin&compressors=zlib&retryWrites=true&w=majority&ssl=true`;

    public static cmsDBConnectionString3 = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.fmr2xrs.mongodb.net/cms:27017,ac-x9mfjzd-shard-00-01.fmr2xrs.mongodb.net:27017,ac-x9mfjzd-shard-00-02.fmr2xrs.mongodb.net:27017/?ssl=true&replicaSet=atlas-d5jvgf-shard-0&authSource=admin&retryWrites=true&w=majority`;
}
