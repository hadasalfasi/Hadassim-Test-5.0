/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [Person_Id]
      ,[Personal_Name]
      ,[Family_Name]
      ,[Gender]
      ,[Father_Id]
      ,[Mother_Id]
      ,[Spose_Id]
  FROM [RelativeTbl].[dbo].[Person_Detail]


   CREATE TABLE Relative_Table (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type NVARCHAR(10),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type)
);


/*הכנסת נתונים לטבלה במקרה שמצא בן/בת/אבא/אמא */
INSERT INTO Relative_Table (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, 'Father' FROM Person_Detail WHERE Father_Id IS NOT NULL
UNION ALL
SELECT Person_Id, Mother_Id, 'Mother' FROM Person_Detail WHERE Mother_Id IS NOT NULL
UNION ALL
SELECT Father_Id, Person_Id, 'son' FROM Person_Detail WHERE Father_Id IS NOT NULL
UNION ALL
SELECT Mother_Id, Person_Id, 'Daughter' FROM Person_Detail WHERE Mother_Id IS NOT NULL
UNION ALL
SELECT Person_Id, Spose_Id, CASE WHEN Gender = 'famle' THEN 'spouseD' ELSE 'spouseS' END FROM Person_Detail WHERE Spose_Id IS NOT NULL;

--הכנסת נתונים במקרה שנמצא אח/אחות
INSERT INTO Relative_Table (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE WHEN p1.Gender = 'male' THEN 'sister' ELSE 'brother' END
FROM Person_Detail p1
JOIN Person_Detail p2 ON p1.Father_Id = p2.Father_Id OR p1.Mother_Id = p2.Mother_Id
WHERE p1.Person_Id <> p2.Person_Id;




--סעיף 2
INSERT INTO Relative_Table(Person_Id, Relative_Id, Connection_Type)
SELECT k.Relative_Id, k.Person_Id,
       CASE WHEN p.Gender = 'daughter' THEN 'spouseD' ELSE 'spouseS' END
FROM Relative_Table k
JOIN Person_Detail p ON k.Person_Id = p.Person_Id
LEFT JOIN Relative_Table k2 ON k.Relative_Id = k2.Person_Id AND k.Person_Id = k2.Relative_Id
WHERE k.Connection_Type IN ('spouseS', 'spouseD') AND k2.Person_Id IS NULL;
