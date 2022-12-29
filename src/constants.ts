export class Constants {
    public static cmsDBConnectionString = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.fmr2xrs.mongodb.net/cms`;
    public static port = 6666;
}
