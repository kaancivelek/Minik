USE [master]
GO
/****** Object:  Database [MinikDB]    Script Date: 15.06.2025 23:44:31 ******/
CREATE DATABASE [MinikDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'MinikDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\MinikDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'MinikDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\MinikDB_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [MinikDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [MinikDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [MinikDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [MinikDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [MinikDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [MinikDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [MinikDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [MinikDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [MinikDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [MinikDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [MinikDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [MinikDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [MinikDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [MinikDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [MinikDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [MinikDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [MinikDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [MinikDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [MinikDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [MinikDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [MinikDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [MinikDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [MinikDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [MinikDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [MinikDB] SET RECOVERY FULL 
GO
ALTER DATABASE [MinikDB] SET  MULTI_USER 
GO
ALTER DATABASE [MinikDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [MinikDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [MinikDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [MinikDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [MinikDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [MinikDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'MinikDB', N'ON'
GO
ALTER DATABASE [MinikDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [MinikDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [MinikDB]
GO
/****** Object:  Table [dbo].[reservations]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[reservations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[tiny_house_id] [int] NOT NULL,
	[check_in] [date] NOT NULL,
	[check_out] [date] NOT NULL,
	[total_price] [decimal](10, 2) NOT NULL,
	[status] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[GetReservationsByUserIdFn]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[GetReservationsByUserIdFn] (@UserId INT)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        user_id,
        tiny_house_id,
        total_price,
        status,
        check_in,
        check_out
    FROM 
        reservations
    WHERE 
        user_id = @UserId
);
GO
/****** Object:  Table [dbo].[locations]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[locations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[country] [varchar](100) NOT NULL,
	[city] [varchar](100) NOT NULL,
	[address] [varchar](255) NOT NULL,
	[latitude] [decimal](9, 6) NOT NULL,
	[longitude] [decimal](9, 6) NOT NULL,
	[user_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[reviews]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[reviews](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[tiny_house_id] [int] NOT NULL,
	[rating] [int] NOT NULL,
	[comment] [text] NOT NULL,
	[review_date] [date] NOT NULL,
 CONSTRAINT [PK__reviews__3213E83F037149A8] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tiny_houses]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tiny_houses](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[description] [text] NOT NULL,
	[location_id] [int] NOT NULL,
	[price_per_night] [decimal](10, 2) NOT NULL,
	[max_guests] [int] NOT NULL,
	[property_owner_id] [int] NOT NULL,
	[amenities] [varchar](255) NOT NULL,
	[is_freezed] [bit] NULL,
 CONSTRAINT [PK__tiny_hou__3213E83F7D3D2DCD] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[GetTinyHouseDetailsById]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[GetTinyHouseDetailsById]
(
    @Id INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        T.id,
        T.name,
        T.description,
        T.location_id,
        T.price_per_night,
        T.max_guests,
        T.property_owner_id,
        T.amenities,
        L.city,
        L.country,
        (
            SELECT CEILING(AVG(CAST(rating AS FLOAT))) 
            FROM reviews 
            WHERE tiny_house_id = T.id
        ) AS average_rating
    FROM tiny_houses T
    JOIN locations L ON T.location_id = L.id
    WHERE T.id = @Id
);
GO
/****** Object:  Table [dbo].[AuditLogs]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[Action] [nvarchar](100) NULL,
	[Entity] [nvarchar](100) NULL,
	[EntityId] [int] NULL,
	[OldValue] [nvarchar](max) NULL,
	[NewValue] [nvarchar](max) NULL,
	[Timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[availability]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[availability](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tiny_house_id] [int] NOT NULL,
	[available_from] [date] NOT NULL,
	[available_to] [date] NOT NULL,
	[is_available] [bit] NULL,
 CONSTRAINT [PK__availabi__3213E83FD4DE4E76] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[discounts]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[discounts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tiny_house_id] [int] NOT NULL,
	[discount_percentage] [int] NOT NULL,
	[valid_from] [date] NOT NULL,
	[valid_until] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[house_images]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[house_images](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tiny_house_id] [int] NOT NULL,
	[image_url] [nvarchar](755) NOT NULL,
 CONSTRAINT [PK__house_im__3213E83F331E9B7C] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[maintenance]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[maintenance](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tiny_house_id] [int] NOT NULL,
	[maintenance_type] [varchar](100) NOT NULL,
	[maintenance_date] [date] NOT NULL,
	[status] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[messages]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[messages](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sender_user_id] [int] NOT NULL,
	[receiver_user_id] [int] NOT NULL,
	[content] [text] NOT NULL,
	[sent_at] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payments]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[reservation_id] [int] NOT NULL,
	[amount] [decimal](10, 2) NOT NULL,
	[payment_method] [varchar](50) NOT NULL,
	[payment_date] [datetime] NOT NULL,
	[payment_status] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] NOT NULL,
	[name] [varchar](15) NOT NULL,
 CONSTRAINT [PK__roles__3213E83F27221C14] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[full_name] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[password_hash] [varchar](255) NOT NULL,
	[role_id] [int] NOT NULL,
	[phone_number] [varchar](15) NOT NULL,
 CONSTRAINT [PK__users__3213E83FDBEC1396] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[wishlist]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[wishlist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[tiny_house_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AuditLogs] ON 

INSERT [dbo].[AuditLogs] ([Id], [UserId], [Action], [Entity], [EntityId], [OldValue], [NewValue], [Timestamp]) VALUES (1, NULL, N'Create', N'Reservation', 26, NULL, N'{"Id":26,"UserId":2,"TinyHouseId":4,"TotalPrice":25000,"Status":"pending","CheckIn":"2025-06-19T00:00:00","CheckOut":"2025-06-20T00:00:00"}', CAST(N'2025-06-15T14:13:34.313' AS DateTime))
SET IDENTITY_INSERT [dbo].[AuditLogs] OFF
GO
SET IDENTITY_INSERT [dbo].[availability] ON 

INSERT [dbo].[availability] ([id], [tiny_house_id], [available_from], [available_to], [is_available]) VALUES (5, 4, CAST(N'2025-06-01' AS Date), CAST(N'2025-07-31' AS Date), 1)
SET IDENTITY_INSERT [dbo].[availability] OFF
GO
SET IDENTITY_INSERT [dbo].[house_images] ON 

INSERT [dbo].[house_images] ([id], [tiny_house_id], [image_url]) VALUES (7, 4, N'https://www.adatinyhouse.com/wp-content/uploads/2023/12/Ada1balkoneski2-394x394.jpg')
INSERT [dbo].[house_images] ([id], [tiny_house_id], [image_url]) VALUES (8, 5, N'https://www.tekbasinadaolur.com/wp-content/uploads/2022/03/Screenshot_19-750x430.png')
SET IDENTITY_INSERT [dbo].[house_images] OFF
GO
SET IDENTITY_INSERT [dbo].[locations] ON 

INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (1, N'Türkiye', N'Çanakkale', N'Boğazın Ortası', CAST(0.000000 AS Decimal(9, 6)), CAST(0.000000 AS Decimal(9, 6)), 4)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (2, N'Türkiye', N'Çanakkale', N'Beyaz, Ahmetçe Sahil Yolu, Yalı Cd. No:47, 17862 Ahmetçe/Ayvacık/Çanakkale', CAST(0.000000 AS Decimal(9, 6)), CAST(0.000000 AS Decimal(9, 6)), 4)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (3, N'türkiye', N'Samsun', N'Samsun İlkadım Çeltik Tarlası 50 Dönüm', CAST(0.000000 AS Decimal(9, 6)), CAST(0.000000 AS Decimal(9, 6)), 4)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (4, N'Turkey', N'Istanbul', N'Kadıköy Moda Caddesi No:15', CAST(41.018611 AS Decimal(9, 6)), CAST(29.025556 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (5, N'Turkey', N'Antalya', N'Kaleiçi Selçuk Mahallesi Sokak No:8', CAST(36.884804 AS Decimal(9, 6)), CAST(30.704044 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (6, N'Turkey', N'Cappadocia', N'Göreme Müze Yolu No:22', CAST(38.642222 AS Decimal(9, 6)), CAST(34.828333 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (7, N'Turkey', N'Bodrum', N'Yalıkavak Marina Bölgesi No:45', CAST(37.095833 AS Decimal(9, 6)), CAST(27.261944 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (8, N'Turkey', N'Fethiye', N'Çalış Plajı Sahil Yolu No:67', CAST(36.622222 AS Decimal(9, 6)), CAST(29.116667 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (9, N'Turkey', N'Kaş', N'Limanağzı Mevkii No:12', CAST(36.202222 AS Decimal(9, 6)), CAST(29.638889 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (10, N'Turkey', N'Olympos', N'Çıralı Sahil Yolu No:33', CAST(36.398056 AS Decimal(9, 6)), CAST(30.472222 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (11, N'Turkey', N'Şirince', N'Bağ Evleri Sokağı No:9', CAST(37.948056 AS Decimal(9, 6)), CAST(27.448611 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (12, N'Turkey', N'Akyaka', N'Gökova Körfezi Kıyısı No:78', CAST(37.052778 AS Decimal(9, 6)), CAST(28.325000 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (13, N'Turkey', N'Datça', N'Eski Datça Köyü Merkez No:56', CAST(36.726111 AS Decimal(9, 6)), CAST(27.685833 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (14, N'Turkey', N'Ayvalık', N'Cunda Adası Sahil Yolu No:23', CAST(39.325000 AS Decimal(9, 6)), CAST(26.693056 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (15, N'Turkey', N'Bozcaada', N'Bağ Yolu Üzeri No:41', CAST(39.833056 AS Decimal(9, 6)), CAST(26.036944 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (16, N'Turkey', N'Alaçatı', N'Rüzgar Gülü Sokağı No:19', CAST(38.295833 AS Decimal(9, 6)), CAST(26.371944 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (17, N'Turkey', N'Çeşme', N'İlica Plajı Yakını No:87', CAST(38.324167 AS Decimal(9, 6)), CAST(26.307500 AS Decimal(9, 6)), 5)
INSERT [dbo].[locations] ([id], [country], [city], [address], [latitude], [longitude], [user_id]) VALUES (19, N'Türkiye', N'Manisa', N'Şehzadeler, Kemalpaşa Mahallesi Altıncılar Sokak No 230', CAST(0.000000 AS Decimal(9, 6)), CAST(0.000000 AS Decimal(9, 6)), 5)
SET IDENTITY_INSERT [dbo].[locations] OFF
GO
SET IDENTITY_INSERT [dbo].[maintenance] ON 

INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (4, 18, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (5, 17, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (6, 16, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (7, 15, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (8, 14, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (9, 13, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (10, 12, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (11, 11, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (12, 10, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (13, 9, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (14, 8, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (15, 7, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (16, 6, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (17, 5, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
INSERT [dbo].[maintenance] ([id], [tiny_house_id], [maintenance_type], [maintenance_date], [status]) VALUES (18, 4, N'undefined', CAST(N'0001-01-01' AS Date), N'completed')
SET IDENTITY_INSERT [dbo].[maintenance] OFF
GO
SET IDENTITY_INSERT [dbo].[payments] ON 

INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (1, 8, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (2, 9, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (3, 10, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (4, 11, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (5, 12, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (6, 13, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (7, 14, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (8, 15, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (9, 16, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (10, 17, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (11, 18, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (12, 19, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (13, 20, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (14, 21, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (15, 22, CAST(1.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (16, 23, CAST(250.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'completed')
INSERT [dbo].[payments] ([id], [reservation_id], [amount], [payment_method], [payment_date], [payment_status]) VALUES (17, 24, CAST(250.00 AS Decimal(10, 2)), N'credit_card', CAST(N'2025-06-15T16:11:55.747' AS DateTime), N'cancelled')
SET IDENTITY_INSERT [dbo].[payments] OFF
GO
SET IDENTITY_INSERT [dbo].[reservations] ON 

INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (8, 4, 18, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (9, 4, 17, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (10, 4, 16, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (11, 4, 15, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (12, 4, 14, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (13, 4, 13, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (14, 4, 12, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (15, 4, 11, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (16, 4, 10, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (17, 4, 9, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (18, 4, 8, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (19, 4, 7, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (20, 4, 6, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (21, 4, 5, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (22, 4, 4, CAST(N'0001-01-01' AS Date), CAST(N'0001-01-01' AS Date), CAST(1.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (23, 2, 4, CAST(N'2025-06-14' AS Date), CAST(N'2025-06-15' AS Date), CAST(250.00 AS Decimal(10, 2)), N'completed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (24, 2, 4, CAST(N'2025-06-15' AS Date), CAST(N'2025-06-16' AS Date), CAST(250.00 AS Decimal(10, 2)), N'confirmed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (25, 2, 4, CAST(N'2025-06-16' AS Date), CAST(N'2025-06-19' AS Date), CAST(75000.00 AS Decimal(10, 2)), N'confirmed')
INSERT [dbo].[reservations] ([id], [user_id], [tiny_house_id], [check_in], [check_out], [total_price], [status]) VALUES (26, 2, 4, CAST(N'2025-06-19' AS Date), CAST(N'2025-06-20' AS Date), CAST(25000.00 AS Decimal(10, 2)), N'confirmed')
SET IDENTITY_INSERT [dbo].[reservations] OFF
GO
INSERT [dbo].[roles] ([id], [name]) VALUES (3, N'admin')
INSERT [dbo].[roles] ([id], [name]) VALUES (1, N'customer')
INSERT [dbo].[roles] ([id], [name]) VALUES (2, N'propertyOwner')
GO
SET IDENTITY_INSERT [dbo].[tiny_houses] ON 

INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (4, N'Boğaz Manzaralı Tiny House', N'İstanbul Boğazı''na nazır, minimalist tasarımlı küçük ev. Şehrin gürültüsünden uzakta huzurlu bir konaklama deneyimi sunar.', 1, CAST(25000.00 AS Decimal(10, 2)), 2, 5, N'WiFi, Klima, Kahve Makinesi, Terras', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (5, N'Akdeniz Rüyası Tiny', N'Antalya''nın tarihi dokusunda, denize yürüme mesafesinde romantik tiny house. Çiftler için ideal.', 2, CAST(180.00 AS Decimal(10, 2)), 2, 5, N'Deniz Manzarası, WiFi, Mutfak, Balkon', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (6, N'Peri Bacası Evi', N'Kapadokya''nın eşsiz coğrafyasında, geleneksel mimariye modern dokunuşlar katılmış tiny house.', 3, CAST(320.00 AS Decimal(10, 2)), 3, 5, N'Sıcak Hava Balonu Manzarası, Şömine, WiFi, Tepe Manzarası', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (7, N'Marina Kenarı Lüks Tiny', N'Bodrum Yalıkavak Marina''ya yakın, lüks donanımlı tiny house. Yat sahibi misafirler için özel.', 4, CAST(450.00 AS Decimal(10, 2)), 4, 5, N'Marina Manzarası, Jakuzi, WiFi, Lüks Banyo, Geniş Terras', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (8, N'Ölüdeniz Tiny Retreat', N'Fethiye''nin berrak sularına bakan, doğayla iç içe tiny house. Doğa severlerin tercihi.', 5, CAST(200.00 AS Decimal(10, 2)), 2, 5, N'Doğa Manzarası, Barbekü Alanı, WiFi, Bisiklet', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (9, N'Akdeniz Sahil Evi', N'Kaş''ın sakin atmosferinde, Akdeniz''e sıfır tiny house. Dalış tutkunları için ideal konum.', 6, CAST(175.00 AS Decimal(10, 2)), 2, 5, N'Deniz Kenarı, Dalış Ekipmanı, WiFi, Güneş Terası', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (10, N'Olimpos Orman Evi', N'Olimpos''un antik atmosferinde, çam ormanları arasında saklanmış tiny house.', 7, CAST(160.00 AS Decimal(10, 2)), 3, 5, N'Orman Manzarası, Doğa Yürüyüş, WiFi, Şömine', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (11, N'Şirince Bağ Evi', N'Şirince''nin üzüm bağları arasında, otantik Rum mimarisinden esinlenmiş tiny house.', 8, CAST(190.00 AS Decimal(10, 2)), 2, 5, N'Bağ Manzarası, Şarap Tadımı, WiFi, Geleneksel Dekor', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (12, N'Gökova Körfez Evi', N'Akyaka''nın eşsiz doğasında, kitesurf severler için ideal tiny house.', 9, CAST(220.00 AS Decimal(10, 2)), 3, 5, N'Körfez Manzarası, Kitesurf Ekipmanı, WiFi, Rüzgar Korumalı Terras', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (13, N'Datça Yarımada Evi', N'Datça''nın sakin atmosferinde, badem ve zeytin ağaçları arasında tiny house.', 10, CAST(165.00 AS Decimal(10, 2)), 2, 5, N'Bahçe, Organik Bahçe, WiFi, Doğal Malzemeler', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (14, N'Cunda Adası Tiny', N'Ayvalık Cunda Adası''nda, Ege''nin masmavi sularına bakan romantik tiny house.', 11, CAST(210.00 AS Decimal(10, 2)), 2, 5, N'Ada Manzarası, WiFi, Balık Tutma, Deniz Bisikleti', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (15, N'Bozcaada Bağ Evi', N'Bozcaada''nın ünlü bağları arasında, ada yaşamının tadını çıkarabileceğiniz tiny house.', 12, CAST(280.00 AS Decimal(10, 2)), 3, 5, N'Bağ Turu, Şarap Mahzeni, WiFi, Ada Bisikleti', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (16, N'Alaçatı Rüzgar Evi', N'Alaçatı''nın renkli sokaklarında, rüzgarsurf için ideal konumda tiny house.', 13, CAST(240.00 AS Decimal(10, 2)), 2, 5, N'Rüzgarsurf Okulu, WiFi, Surf Tahtası, Alaçatı Turu', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (17, N'İlica Termal Tiny', N'Çeşme İlica''da, termal suların kenarında, sağlık turizmi için ideal tiny house.', 14, CAST(195.00 AS Decimal(10, 2)), 4, 5, N'Termal Su, Spa Hizmetleri, WiFi, Wellness Programı', 0)
INSERT [dbo].[tiny_houses] ([id], [name], [description], [location_id], [price_per_night], [max_guests], [property_owner_id], [amenities], [is_freezed]) VALUES (18, N'Safranbolu Tarihi Tiny', N'Safranbolu''nun UNESCO mirası sokaklarında, Osmanlı mimarisine uygun tasarlanmış tiny house.', 15, CAST(150.00 AS Decimal(10, 2)), 3, 5, N'Tarihi Tur, Geleneksel Dekor, WiFi, Safranbolu Lokumu', 0)
SET IDENTITY_INSERT [dbo].[tiny_houses] OFF
GO
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([id], [full_name], [email], [password_hash], [role_id], [phone_number]) VALUES (2, N'Kaan Civelek', N'kaancivelek17@gmail.com', N'$2a$11$QKMOdpliwZzEJhUMj1d6neWqOzUj17X2CsNAvyaO0HQgo8oEQ8GOm', 1, N'05397031329')
INSERT [dbo].[users] ([id], [full_name], [email], [password_hash], [role_id], [phone_number]) VALUES (3, N'Kaan Civelek', N'businesskaancivelek@gmail.com', N'$2a$11$rcd4G4yZ9UhxdiyCPmRbrexKv6ZutL8cPmM8CsLeOJ4mzpnh4dbZe', 3, N'05397031328')
INSERT [dbo].[users] ([id], [full_name], [email], [password_hash], [role_id], [phone_number]) VALUES (4, N'Kaan Civelek', N'kaancivelek17@hotmail.com', N'$2a$11$N4qUAgIjOEe0gIKHD96h4eJkZwG.jm6BEltjihVo6gRLQ2PVXlHR.', 2, N'05397031327')
INSERT [dbo].[users] ([id], [full_name], [email], [password_hash], [role_id], [phone_number]) VALUES (5, N'Vehmi Koç', N'kocvehmi@gmail.com', N'$2b$10$XOvgLqE7isj1PVfDrmSW5eXqf5QhkrkSJ7QLEWErC1YBc6CNmfoYu', 2, N'05555555555')
SET IDENTITY_INSERT [dbo].[users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__roles__72E12F1B8AF8ECEF]    Script Date: 15.06.2025 23:44:31 ******/
ALTER TABLE [dbo].[roles] ADD  CONSTRAINT [UQ__roles__72E12F1B8AF8ECEF] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__users__AB6E61643ACBB5FD]    Script Date: 15.06.2025 23:44:31 ******/
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [UQ__users__AB6E61643ACBB5FD] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[availability] ADD  CONSTRAINT [DF__availabil__is_av__68487DD7]  DEFAULT ((1)) FOR [is_available]
GO
ALTER TABLE [dbo].[reviews] ADD  CONSTRAINT [Df_rating]  DEFAULT ((0)) FOR [rating]
GO
ALTER TABLE [dbo].[tiny_houses] ADD  CONSTRAINT [df_is_freezed]  DEFAULT ((0)) FOR [is_freezed]
GO
ALTER TABLE [dbo].[availability]  WITH CHECK ADD  CONSTRAINT [FK__availabil__tiny___693CA210] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[availability] CHECK CONSTRAINT [FK__availabil__tiny___693CA210]
GO
ALTER TABLE [dbo].[discounts]  WITH CHECK ADD  CONSTRAINT [FK__discounts__tiny___5812160E] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
GO
ALTER TABLE [dbo].[discounts] CHECK CONSTRAINT [FK__discounts__tiny___5812160E]
GO
ALTER TABLE [dbo].[house_images]  WITH CHECK ADD  CONSTRAINT [FK__house_ima__tiny___4CA06362] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[house_images] CHECK CONSTRAINT [FK__house_ima__tiny___4CA06362]
GO
ALTER TABLE [dbo].[maintenance]  WITH CHECK ADD  CONSTRAINT [FK__maintenan__tiny___5AEE82B9] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
GO
ALTER TABLE [dbo].[maintenance] CHECK CONSTRAINT [FK__maintenan__tiny___5AEE82B9]
GO
ALTER TABLE [dbo].[messages]  WITH CHECK ADD  CONSTRAINT [FK__messages__receiv__440B1D61] FOREIGN KEY([receiver_user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[messages] CHECK CONSTRAINT [FK__messages__receiv__440B1D61]
GO
ALTER TABLE [dbo].[messages]  WITH CHECK ADD  CONSTRAINT [FK__messages__sender__4316F928] FOREIGN KEY([sender_user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[messages] CHECK CONSTRAINT [FK__messages__sender__4316F928]
GO
ALTER TABLE [dbo].[payments]  WITH CHECK ADD FOREIGN KEY([reservation_id])
REFERENCES [dbo].[reservations] ([id])
GO
ALTER TABLE [dbo].[reservations]  WITH CHECK ADD  CONSTRAINT [FK__reservati__tiny___403A8C7D] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
GO
ALTER TABLE [dbo].[reservations] CHECK CONSTRAINT [FK__reservati__tiny___403A8C7D]
GO
ALTER TABLE [dbo].[reservations]  WITH CHECK ADD  CONSTRAINT [FK__reservati__user___3F466844] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[reservations] CHECK CONSTRAINT [FK__reservati__user___3F466844]
GO
ALTER TABLE [dbo].[reviews]  WITH CHECK ADD  CONSTRAINT [FK__reviews__tiny_ho__5165187F] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
GO
ALTER TABLE [dbo].[reviews] CHECK CONSTRAINT [FK__reviews__tiny_ho__5165187F]
GO
ALTER TABLE [dbo].[reviews]  WITH CHECK ADD  CONSTRAINT [FK__reviews__user_id__5070F446] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[reviews] CHECK CONSTRAINT [FK__reviews__user_id__5070F446]
GO
ALTER TABLE [dbo].[tiny_houses]  WITH CHECK ADD  CONSTRAINT [FK__tiny_hous__locat__3C69FB99] FOREIGN KEY([location_id])
REFERENCES [dbo].[locations] ([id])
GO
ALTER TABLE [dbo].[tiny_houses] CHECK CONSTRAINT [FK__tiny_hous__locat__3C69FB99]
GO
ALTER TABLE [dbo].[tiny_houses]  WITH CHECK ADD  CONSTRAINT [FK_tiny_houses_users] FOREIGN KEY([property_owner_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[tiny_houses] CHECK CONSTRAINT [FK_tiny_houses_users]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [FK_users_roles] FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [FK_users_roles]
GO
ALTER TABLE [dbo].[wishlist]  WITH CHECK ADD  CONSTRAINT [FK__wishlist__tiny_h__5535A963] FOREIGN KEY([tiny_house_id])
REFERENCES [dbo].[tiny_houses] ([id])
GO
ALTER TABLE [dbo].[wishlist] CHECK CONSTRAINT [FK__wishlist__tiny_h__5535A963]
GO
ALTER TABLE [dbo].[wishlist]  WITH CHECK ADD  CONSTRAINT [FK__wishlist__user_i__5441852A] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[wishlist] CHECK CONSTRAINT [FK__wishlist__user_i__5441852A]
GO
ALTER TABLE [dbo].[reviews]  WITH CHECK ADD  CONSTRAINT [CK__reviews__rating__6754599E] CHECK  (([rating]>=(1) AND [rating]<=(5)))
GO
ALTER TABLE [dbo].[reviews] CHECK CONSTRAINT [CK__reviews__rating__6754599E]
GO
/****** Object:  StoredProcedure [dbo].[getFullNameByUserId]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[getFullNameByUserId] @userId int
AS

SELECT full_name
FROM users
WHERE id = @userId
/*Kaan Civelek*/
GO
/****** Object:  StoredProcedure [dbo].[getUserByUserId]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[getUserByUserId] @userId int
AS

SELECT *
FROM users
WHERE id = @userId
/*Kaan Civelek*/
GO
/****** Object:  StoredProcedure [dbo].[sp_Update_Reservation_Status_To_Completed]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[sp_Update_Reservation_Status_To_Completed]
AS
UPDATE reservations
SET status ='completed'
WHERE check_out <= GETDATE()
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateAvailabilityStatus]    Script Date: 15.06.2025 23:44:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_UpdateAvailabilityStatus]
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE availability
    SET is_available = CASE 
        WHEN available_from <= CAST(GETDATE() AS DATE) AND available_to >= CAST(GETDATE() AS DATE)
            THEN 1
        ELSE 0
    END;
END;
GO
USE [master]
GO
ALTER DATABASE [MinikDB] SET  READ_WRITE 
GO
