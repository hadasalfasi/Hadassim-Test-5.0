using System.Drawing;
using System.Text;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using ParquetSharp;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace FirstTask
{
    internal class Program
    {

        //חלק א סעיף א
        //פונקציה שמחלקת לקבצים קטנים
        public static List<List<string>> DivideLogFile(string filePath, int size = 500)
        {

            int cnt = 0;
            var allparts = new List<List<string>>();
            var part = new List<string>();
            foreach (var line in File.ReadLines(filePath))
            {
                part.Add(line);
                cnt++;
                if (cnt == size)
                {
                    allparts.Add(part);
                    part = new List<string>();
                    cnt = 0;
                }
            }
            if (cnt > 0)
            {
                allparts.Add(part);
            }
            return allparts;

        }

        //פונקציה שמחזירה מילון שכיחויות לחלק בודד
        public static Dictionary<string, int> Frequencycounting(List<string> list)
        {
            Dictionary<string, int> frequency = new Dictionary<string, int>();
            foreach (var line in list)
            {

                string[] parts = line.Split(new string[] { ", Error: " }, StringSplitOptions.None);

                if (parts.Length > 1)
                {
                    string errorCode = parts[1].Trim();

                    if (frequency.ContainsKey(errorCode))
                    {
                        frequency[errorCode]++;
                    }
                    else
                    {
                        frequency[errorCode] = 1;
                    }
                }
            }
            return frequency;
        }


        //פונקציה שמאחדת את כל השכיחויות ומחזירה מילון אחד גדול
        public static Dictionary<string, int> SumAllErrors(List<Dictionary<string, int>> list)
        {
            Dictionary<string, int> dict = new Dictionary<string, int>();
            foreach (var node in list)
            {
                foreach (var inernode in node)
                {
                    if (!(dict.ContainsKey(inernode.Key)))
                    {
                        dict[inernode.Key] = 0;
                    }
                    dict[inernode.Key] += inernode.Value;

                }

            }

            return dict;
        }

        //פונקציה שמדפיסה את ה N השכיחויות
        public static void PrintTopN(Dictionary<string, int> dict, int N)
        {
            if (N > dict.Count())
            {
                Console.WriteLine("There are less then " + N + " error.");
            }
            else
            {
                var topN = dict.OrderByDescending(x => x.Value).Take(N);
                Console.WriteLine($"Top {N} most frequent error codes:");
                foreach (var node in topN)
                {
                    Console.WriteLine($"{node.Key}: {node.Value}");
                }

            }
        }
        //פונקציה שקוראת להכל
        public static void TaskA(string filepath, int N)
        {
            List<List<string>> list = DivideLogFile(filepath);
            List<Dictionary<string, int>> listofdicts = new List<Dictionary<string, int>>();
            foreach (var node in list)
            {
                listofdicts.Add(Frequencycounting(node));
            }
            PrintTopN(SumAllErrors(listofdicts), N);
        }
        //סיבוכיות זמן ומקום צרפתי דף וורד בתיקית הפרויקט הנוכחי
        //////////////////
        //עד כאן סעיף א
        /////////////////


        //חלק א סעיף ב

        public static bool tests(string line)
        {
            string[] parts = line.Split(',');
            if (parts.Length != 2) return false;
            string datePattern = @"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$";
            if (!Regex.IsMatch(parts[0], datePattern)) return false;
            if (!double.TryParse(parts[1], out _)) return false;

            return true;
        }



        //פונקציה שמחשבת את הממוצע לשעה
        //יש 2 מילונים , עוברים על הקובץ וכל שורה חותכים את התאריך עם הספרה הראשונה של השעה
        //ואז בודקים במילון של הסכימה אם כבר יש תא עם שעה כזאת גם לפי תאריך וגם לפי שעה
        //ואז מוסיפים את הסכום של השעה ובמילון של הכמות עושים באותו מיקוםשל התאריך והשעה פלוספלו
        //אח"כ עוברים על המילון ועושים ממוצע בין שני המילונים
        //
        public static Dictionary<string, double> avgforhour(string filepath)
        {
            Dictionary<string, double> avgdict = new Dictionary<string, double>();
            Dictionary<string, double> sumdict = new Dictionary<string, double>();
            Dictionary<string, double> numdict = new Dictionary<string, double>();
            DateTime timestamp;
            string time_date;
            string[] parts = new string[2];
            double temp = 0;
            bool firstLine = true;
            if (!File.Exists(filepath))
            {
                return avgdict;
            }
            foreach (var line in File.ReadLines(filepath))
            {
                if (firstLine)
                {
                    firstLine = false;
                    continue;
                }

                if (tests(line))
                {
                    parts = line.Split(',')
                        .Select(x => x.Trim())
                        .ToArray();
                    timestamp = DateTime.Parse(parts[0]);
                    time_date = timestamp.ToString("MM/dd/yyyy HH");
                    temp = double.Parse(parts[1]);

                    if (!sumdict.ContainsKey(time_date))
                    {
                        sumdict[time_date] = 0;
                        numdict[time_date] = 0;
                    }

                    if (temp > 0)
                    {
                        sumdict[time_date] += temp;
                        numdict[time_date] += 1;
                    }
                }
            }


            double avg;
            foreach (var x in sumdict)
            {
                avg = x.Value / numdict[x.Key];
                Console.WriteLine($"{x.Key}  =>  avg: {avg:F2}");
                avgdict[x.Key] = avg;
            }


            return avgdict;
        }

        //פונקציה לחילוק הקובץ לחלקים קטנים לפי תאריך
        public static void SpliteFileByDay(string inputPath, string outputFolder)
        {

            var data = ReadTimeSeries(inputPath);
            string ext = Path.GetExtension(inputPath).ToLower();
            var chunksByDay = new Dictionary<string, List<(DateTime, double)>>();

            foreach (var (timestamp, value) in data)
            {
                string dayKey = timestamp.ToString("yyyy-MM-dd");
                if (!chunksByDay.ContainsKey(dayKey))
                    chunksByDay[dayKey] = new List<(DateTime, double)>();
                chunksByDay[dayKey].Add((timestamp, value));
            }
            foreach (var day in chunksByDay)
            {
                string filePath = Path.Combine("C:\\Users\\1\\Desktop\\הדסים\\Part1\\Files", $"{day.Key}{ext}");

                if (ext == ".csv")
                {
                    using (var writer = new StreamWriter(filePath))
                    {
                        writer.WriteLine("timestamp,value");
                        foreach (var (timestamp, value) in day.Value)
                        {
                            writer.WriteLine($"{timestamp},{value}");
                        }
                    }
                }
                else if (ext == ".parquet")
                {
                    using var writer = new ParquetFileWriter(filePath, new Column[]
                    {
                        new Column<DateTime>("Timestamp"),
                        new Column<double>("Value")
                    });

                    using var rowGroup = writer.AppendRowGroup();
                    rowGroup.NextColumn().LogicalWriter<DateTime>().WriteBatch(day.Value.Select(x => x.Item1).ToArray());
                    rowGroup.NextColumn().LogicalWriter<double>().WriteBatch(day.Value.Select(x => x.Item2).ToArray());
                    writer.Close();
                }

            }

            //    var data = ReadTimeSeries(inputPath);
            //    string ext = Path.GetExtension(inputPath).ToLower();
            //    var chunksByDay = new Dictionary<string, List<string>>();
            //    bool isFirstLine = true;
            //    foreach (var line in File.ReadLines(inputPath))
            //    {
            //        if (isFirstLine)
            //        {
            //            isFirstLine = false;
            //            continue;
            //        }
            //        if (tests(line))
            //        {

            //            var parts = line.Split(',');
            //            DateTime timestamp = DateTime.Parse(parts[0]);
            //            string dayKey = timestamp.ToString("yyyy-MM-dd");
            //            if (!chunksByDay.ContainsKey(dayKey))
            //                chunksByDay[dayKey] = new List<string>();
            //            chunksByDay[dayKey].Add(line);
            //        }

            //    }
            //    foreach (var day in chunksByDay)
            //    {
            //        string filePath = Path.Combine(outputFolder, $"time_{day.Key}.csv");
            //        File.WriteAllLines(filePath, new[] { "timestamp,value" }.Concat(day.Value));
            //    }
            //    return chunksByDay;
        }


        public static List<(DateTime timestamp, double value)> ReadTimeSeries(string filePath)
        {
            string extension = Path.GetExtension(filePath).ToLower();
            var result = new List<(DateTime, double)>();

            if (extension == ".csv")
            {
                bool isFirstLine = true;
                foreach (var line in File.ReadLines(filePath))
                {
                    if (isFirstLine) { isFirstLine = false; continue; }
                    if (!tests(line)) continue;

                    var parts = line.Split(',');
                    DateTime timestamp = DateTime.Parse(parts[0]);
                    double value = double.Parse(parts[1]);
                    if (value > 0)
                        result.Add((timestamp, value));
                }
            }
            else if (extension == ".parquet")
            {
                using var fileReader = new ParquetFileReader(filePath);
                for (int i = 0; i < fileReader.FileMetaData.NumRowGroups; i++)
                {
                    using var rowGroupReader = fileReader.RowGroup(i);
                    int rowCount = (int)rowGroupReader.MetaData.NumRows;

                    DateTime[] timestamps;
                    double[] values;

                    try
                    {
                        timestamps = rowGroupReader.Column(0).LogicalReader<DateTime>().ReadAll(rowCount);
                    }
                    catch
                    {
                        var tsStrings = rowGroupReader.Column(0).LogicalReader<string>().ReadAll(rowCount);
                        timestamps = tsStrings
                            .Select(s => DateTime.TryParse(s, out var t) ? t : DateTime.MinValue)
                            .ToArray();
                    }

                    try
                    {
                        values = rowGroupReader.Column(1).LogicalReader<double>().ReadAll(rowCount);
                    }
                    catch
                    {
                        var valStrings = rowGroupReader.Column(1).LogicalReader<string>().ReadAll(rowCount);
                        values = valStrings
                            .Select(s => double.TryParse(s, out var d) ? d : -1)
                            .ToArray();
                    }

                    for (int j = 0; j < rowCount; j++)
                    {
                        if (timestamps[j] != DateTime.MinValue && values[j] > 0)
                        {
                            result.Add((timestamps[j], values[j]));
                        }
                    }
                }
            }

            return result;
        }

        //פונקציה לאיחוד הממוצעים
        public static void MergeAllAvgHours(string inputPath)
        {
            var allParquet = Directory.GetFiles(inputPath, "*.parquet");
            var allFiles = Directory.GetFiles(inputPath, "*.csv");
            var allAveragesCsv = new List<(string Hour, double Average)>();
            var allAveragesParquet = new List<(string Hour, double Average)>();
            foreach (var file in allFiles)
            {
                var dict = avgforhour(file);
                foreach (var item in dict)
                {
                    allAveragesCsv.Add((item.Key, item.Value));
                }

            }
            using (var writer = new StreamWriter($"{inputPath}\\avg.csv"))
            {
                writer.WriteLine("StartTime,Average");
                foreach (var item in allAveragesCsv.OrderBy(e => e.Hour))
                {
                    writer.WriteLine($"{item.Hour},{item.Average:F2}");
                }
            }

            foreach (var file in allParquet)
            {
                var dict = avgforhour(file);
                foreach (var item in dict)
                    allAveragesParquet.Add((item.Key, item.Value));
            }

            var startTimes = allAveragesParquet.Select(a => DateTime.ParseExact(a.Hour, "yyyy-MM-dd HH", CultureInfo.InvariantCulture)).ToArray();
            var averages = allAveragesParquet.Select(a => a.Average).ToArray();

            using (var writer = new ParquetFileWriter($"{inputPath}\\avg.parquet", new Column[]
            {
        new Column<DateTime>("StartTime"),
        new Column<double>("Average")
            }))
            {
                using (var rowGroup = writer.AppendRowGroup())
                {
                    rowGroup.NextColumn().LogicalWriter<DateTime>().WriteBatch(startTimes);
                    rowGroup.NextColumn().LogicalWriter<double>().WriteBatch(averages);
                }
                writer.Close();
            }
        }
        public static void TaskB(string fileCsv, string fileParquet)
        {
            string workdir = "C:\\Users\\1\\Desktop\\הדסים\\Part1\\Files";
            SpliteFileByDay(fileCsv, workdir);
            SpliteFileByDay(fileParquet, workdir);
            MergeAllAvgHours(workdir);
        }
        static void Main(string[] args)
        {

            TaskA("C:\\Users\\1\\Downloads\\logs.csv", 5);
            Console.WriteLine("--------------------------------------------");
            TaskB("C:\\Users\\1\\Downloads\\time_series.csv", "C:\\Users\\1\\Downloads\\time_series.parquet");

            //TaskA();
            //avgforhour("C:\\Users\\1\\Downloads\\time_series.csv");
            // avgforhour("C:\\Users\\1\\Downloads\\חוברת1.csv");
            // Console.WriteLine(tests("12/2025 , 95"));

            //DivideLogFile("C:\\Users\\1\\Downloads\\logs.txt");

        }







    }
}
