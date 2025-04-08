//using ParquetSharp;
//using System.Globalization;

//uusing System.Security.Cryptography.X509Certificates;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Globalization;
//using ParquetSharp;
//using System.Threading.Tasks;


//namespace Task_1
//{
//    internal class Program
//    {
//        //פונקציה שמחלקת לחלקים קטנים
//        public static List<List<string>> SpliteLogFile(string filePath, int size = 10000)
//        {
//            var file = new List<List<string>>();
//            var chunk = new List<string>();
//            int cnt = 0;
//            foreach (var line in File.ReadLines(filePath))
//            {
//                chunk.Add(line);
//                cnt++;

//                if (cnt >= size)
//                {
//                    file.Add(chunk);
//                    chunk = new List<string>();
//                    cnt = 0;
//                }
//            }

//            if (cnt > 0)
//            {
//                file.Add(chunk);
//            }

//            return file;
//        }
//        //פונקציה שמחזירה מילון שכיחויות לחלק בודד
//        public static Dictionary<string, int> CountErrorsInNode(List<string> list)
//        {
//            Dictionary<string, int> errorCounts = new Dictionary<string, int>();
//            foreach (var line in list)
//            {
//                string[] parts = line.Split(new string[] { ", Error: " }, StringSplitOptions.None);

//                if (parts.Length > 1)
//                {
//                    string errorCode = parts[1].Trim();

//                    if (!errorCounts.ContainsKey(errorCode))
//                        errorCounts[errorCode] = 0;
//                    errorCounts[errorCode]++;
//                }
//            }
//            return errorCounts;

//        }
//        //פונקציה שמחזירה מילון מאוחד של כלל השכיחויות
//        public static Dictionary<string, int> SumAllCountErrors(List<Dictionary<string, int>> list)
//        {
//            Dictionary<string, int> totalCount = new Dictionary<string, int>();
//            foreach (var dictionary in list)
//            {
//                foreach (var item in dictionary)
//                {
//                    if (!totalCount.ContainsKey(item.Key))
//                        totalCount[item.Key] = 0;
//                    totalCount[item.Key] += item.Value;
//                }
//            }
//            return totalCount;
//        }
//        //פונקציה שמדפיסה את N השכיחויות
//        public static void PrintN(Dictionary<string, int> dictionary, int N)
//        {
//            if (N > dictionary.Count())
//            {
//                Console.WriteLine("There are less then N errors");
//            }
//            else
//            {
//                var topN = dictionary.OrderByDescending(x => x.Value).Take(N);

//                Console.WriteLine($"Top {N} Error Codes:");
//                foreach (var item in topN)
//                {
//                    Console.WriteLine($"{item.Key}: {item.Value}");
//                }
//            }
//        }
//        //פונקציה שמפעילה את כל המשימות של סעיף א
//        public static void ProcessA(string filePath, int N)
//        {
//            List<List<string>> list = SpliteLogFile(filePath);
//            List<Dictionary<string, int>> listOfDictionaries = new List<Dictionary<string, int>>();
//            foreach (var item in list)
//            {
//                listOfDictionaries.Add(CountErrorsInNode(item));
//            }
//            PrintN(SumAllCountErrors(listOfDictionaries), N);
//        }
//        //סיבוכיות זמן ומקום בדף וורד


//        //פונקציה בדיקת תקינות
//        public static bool Validation(string line)
//        {
//            string[] parts = line.Split(',');
//            return parts.Length == 2 && DateTime.TryParse(parts[0], out _) && double.TryParse(parts[1], out _);
//        }

//        //פונקציה למציאת ממוצע שעתי
//        public static Dictionary<string, double> AvgHours(string filePath)
//        {
//            var data = ReadTimeSeries(filePath);
//            var avgDict = new Dictionary<string, double>();
//            var sumAndCountDict = new Dictionary<string, (double sum, int count)>();

//            foreach (var (timestamp, value) in data)
//            {
//                string hourKey = timestamp.ToString("yyyy-MM-dd HH");
//                if (!sumAndCountDict.ContainsKey(hourKey))
//                    sumAndCountDict[hourKey] = (0, 0);
//                sumAndCountDict[hourKey] = (sumAndCountDict[hourKey].sum + value, sumAndCountDict[hourKey].count + 1);
//            }

//            foreach (var entry in sumAndCountDict.OrderBy(e => e.Key))
//            {
//                double average = entry.Value.sum / entry.Value.count;
//                avgDict[entry.Key] = average;
//                Console.WriteLine($"{entry.Key}: avg = {average:F2}");
//            }
//            return avgDict;
//        }
//        //פונקציה לחילוק הקובץ לקבצים קטנים לפי תאריך
//        public static void SpliteFileByDay(string inputPath, string outputFolder)
//        {
//            var data = ReadTimeSeries(inputPath);
//            string ext = Path.GetExtension(inputPath).ToLower();
//            var chunksByDay = new Dictionary<string, List<(DateTime, double)>>();

//            foreach (var (timestamp, value) in data)
//            {
//                string dayKey = timestamp.ToString("yyyy-MM-dd");
//                if (!chunksByDay.ContainsKey(dayKey))
//                    chunksByDay[dayKey] = new List<(DateTime, double)>();
//                chunksByDay[dayKey].Add((timestamp, value));
//            }
//            foreach (var day in chunksByDay)
//            {
//                string filePath = Path.Combine(outputFolder, $"{day.Key}{ext}");

//                if (ext == ".csv")
//                {
//                    using (var writer = new StreamWriter(filePath))
//                    {
//                        writer.WriteLine("timestamp,value");
//                        foreach (var (timestamp, value) in day.Value)
//                        {
//                            writer.WriteLine($"{timestamp},{value}");
//                        }
//                    }
//                }
//                else if (ext == ".parquet")
//                {
//                    using var writer = new ParquetFileWriter(filePath, new Column[]
//                    {
//                        new Column<DateTime>("Timestamp"),
//                        new Column<double>("Value")
//                    });

//                    using var rowGroup = writer.AppendRowGroup();
//                    rowGroup.NextColumn().LogicalWriter<DateTime>().WriteBatch(day.Value.Select(x => x.Item1).ToArray());
//                    rowGroup.NextColumn().LogicalWriter<double>().WriteBatch(day.Value.Select(x => x.Item2).ToArray());
//                    writer.Close();
//                }

//            }
//        }
//        //פונקציה לאיחוד הממוצעים
//        public static void MergeAllAvgHours(string inputPath)
//        {
//            var allCsv = Directory.GetFiles(inputPath, "*.csv");
//            var allParquet = Directory.GetFiles(inputPath, "*.parquet");
//            var allAveragesCsv = new List<(string Hour, double Average)>();
//            var allAveragesParquet = new List<(string Hour, double Average)>();

//            foreach (var file in allCsv)
//            {
//                var dict = AvgHours(file);
//                foreach (var item in dict)
//                {
//                    allAveragesCsv.Add((item.Key, item.Value));
//                }
//            }

//            using (var writer = new StreamWriter($"{inputPath}\\avg.csv"))
//            {
//                writer.WriteLine("StartTime,Average");
//                foreach (var item in allAveragesCsv.OrderBy(e => e.Hour))
//                {
//                    writer.WriteLine($"{item.Hour},{item.Average:F2}");
//                }
//            }

//            foreach (var file in allParquet)
//            {
//                var dict = AvgHours(file);
//                foreach (var item in dict)
//                    allAveragesParquet.Add((item.Key, item.Value));
//            }

//            var startTimes = allAveragesParquet.Select(a => DateTime.ParseExact(a.Hour, "yyyy-MM-dd HH", CultureInfo.InvariantCulture)).ToArray();
//            var averages = allAveragesParquet.Select(a => a.Average).ToArray();

//            using (var writer = new ParquetFileWriter($"{inputPath}\\avg.parquet", new Column[]
//            {
//        new Column<DateTime>("StartTime"),
//        new Column<double>("Average")
//            }))
//            {
//                using (var rowGroup = writer.AppendRowGroup())
//                {
//                    rowGroup.NextColumn().LogicalWriter<DateTime>().WriteBatch(startTimes);
//                    rowGroup.NextColumn().LogicalWriter<double>().WriteBatch(averages);
//                }
//                writer.Close();
//            }
//        }
//        //סעיף ב/3 בקובץ וורד

//        //התאמה לPARQUET
//        //יתרונות פורמט Parquet לאחסון מידע:
//        //פורמט עמודות-מאפשר קריאה רק של עמודות נדרשות,דבר שמייעל ביצועים וחוסך בזיכרון
//        //הפורמט תומך בדחיסת נתונים חכמה שמפחיתה את גודל הקובץ ומאפשרת אחסון חסכוני יותר
//        //הפורמט מהיר לניתוח נתונים – מתאים במיוחד לעבודה עם כמויות גדולות של מידע
//        //הפורמט שומר טיפוסים – כל עמודה שומרת טיפוס נתונים דבר שמקל על טעינה ועיבוד הנתונים

//        public static List<(DateTime timestamp, double value)> ReadTimeSeries(string filePath)
//        {
//            string extension = Path.GetExtension(filePath).ToLower();
//            var result = new List<(DateTime, double)>();

//            if (extension == ".csv")
//            {
//                bool isFirstLine = true;
//                foreach (var line in File.ReadLines(filePath))
//                {
//                    if (isFirstLine) { isFirstLine = false; continue; }
//                    if (!Validation(line)) continue;

//                    var parts = line.Split(',');
//                    DateTime timestamp = DateTime.Parse(parts[0]);
//                    double value = double.Parse(parts[1]);
//                    if (value > 0)
//                        result.Add((timestamp, value));
//                }
//            }
//            else if (extension == ".parquet")
//            {
//                using var fileReader = new ParquetFileReader(filePath);
//                for (int i = 0; i < fileReader.FileMetaData.NumRowGroups; i++)
//                {
//                    using var rowGroupReader = fileReader.RowGroup(i);
//                    int rowCount = (int)rowGroupReader.MetaData.NumRows;

//                    DateTime[] timestamps;
//                    double[] values;

//                    try
//                    {
//                        timestamps = rowGroupReader.Column(0).LogicalReader<DateTime>().ReadAll(rowCount);
//                    }
//                    catch
//                    {
//                        var tsStrings = rowGroupReader.Column(0).LogicalReader<string>().ReadAll(rowCount);
//                        timestamps = tsStrings
//                            .Select(s => DateTime.TryParse(s, out var t) ? t : DateTime.MinValue)
//                            .ToArray();
//                    }

//                    try
//                    {
//                        values = rowGroupReader.Column(1).LogicalReader<double>().ReadAll(rowCount);
//                    }
//                    catch
//                    {
//                        var valStrings = rowGroupReader.Column(1).LogicalReader<string>().ReadAll(rowCount);
//                        values = valStrings
//                            .Select(s => double.TryParse(s, out var d) ? d : -1)
//                            .ToArray();
//                    }

//                    for (int j = 0; j < rowCount; j++)
//                    {
//                        if (timestamps[j] != DateTime.MinValue && values[j] > 0)
//                        {
//                            result.Add((timestamps[j], values[j]));
//                        }
//                    }
//                }
//            }

//            return result;
//        }

//        public static void ProcessB(string fileCsv, string fileParquet)
//        {
//            string workDir = @"C:\Users\This User\Documents\Studies\הדסים\Task 1\Files";
//            SpliteFileByDay(fileCsv, workDir);
//            SpliteFileByDay(fileParquet, workDir);
//            MergeAllAvgHours(workDir);
//        }

//        static void Main(string[] args)
//        {
//            ProcessA(@"C:\Users\This User\Downloads\logs.txt", 5);
//            ProcessB(@"C:\Users\This User\Downloads\time_series.csv", @"C:\Users\This User\Downloads\time_series.parquet");
//        }
//    }
//}