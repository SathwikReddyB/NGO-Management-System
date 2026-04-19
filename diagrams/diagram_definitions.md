# NGO Management Project - Diagram Definitions

This document contains the Mermaid source code for the requested diagrams.

## 1. System Architecture
```mermaid
graph TD
    Client["User Browser (React + Vite)"]
    Server["Backend API (Node.js + Express)"]
    DB[("MySQL Database")]
    
    Client -- "HTTP/JSON" --> Server
    Server -- "SQL Queries" --> DB
    
    subgraph "Frontend Layer"
        Client
    end
    
    subgraph "Backend Layer"
        Server
        subgraph "Middleware"
            CORS[CORS]
            JSON[Express JSON]
        end
    end
    
    subgraph "Data Layer"
        DB
    end
```

## 2. Use Case Diagram
```mermaid
useCaseDiagram
    actor "NGO Admin" as NGO
    actor "Candidate / Volunteer" as Candidate
    
    package "NGO Management System" {
        usecase "Register NGO" as UC1
        usecase "Login" as UC2
        usecase "Create Time Slot" as UC3
        usecase "View Dashboard Stats" as UC4
        usecase "Search NGOs" as UC5
        usecase "Book Volunteer Slot" as UC6
        usecase "Donate / Enroll" as UC7
        usecase "Manage Profile" as UC8
    }
    
    NGO --> UC1
    NGO --> UC2
    NGO --> UC3
    NGO --> UC4
    NGO --> UC8
    
    Candidate --> UC2
    Candidate --> UC5
    Candidate --> UC6
    Candidate --> UC7
    Candidate --> UC8
```

## 3. ER Diagram
```mermaid
erDiagram
    NGOS {
        string id PK
        string name
        string email
        string phone
        string address
        string website
        string category
        int volunteers
        int fundingGoal
        int currentFunding
    }
    CANDIDATES {
        string id PK
        string name
        string email
        string phone
        json skills
        string availability
    }
    TIME_SLOTS {
        string id PK
        string ngoId FK
        date date
        time startTime
        time endTime
        int capacity
        int booked
    }
    BOOKINGS {
        string id PK
        string candidateId FK
        string slotId FK
        string ngoId FK
        timestamp date
    }
    ENROLLMENTS {
        string id PK
        string candidateId FK
        string ngoId FK
        string serviceType
        int amount
        timestamp date
    }

    NGOS ||--o{ TIME_SLOTS : "hosts"
    NGOS ||--o{ BOOKINGS : "manages"
    NGOS ||--o{ ENROLLMENTS : "receives"
    CANDIDATES ||--o{ BOOKINGS : "makes"
    CANDIDATES |o--o{ ENROLLMENTS : "donates"
    TIME_SLOTS ||--o{ BOOKINGS : "filled_by"
```

## 4. DFD (Level 1)
```mermaid
graph LR
    User((User)) --> P1(Authentication)
    P1 --> DS1[(User Store)]
    
    User --> P2(NGO Management)
    P2 <-> DS2[(NGOs table)]
    
    User --> P3(Booking System)
    P3 <-> DS3[(Slots & Bookings)]
    
    User --> P4(Enrollment)
    P4 --> DS4[(Enrollments table)]
```

## 5. Class Diagram (Backend)
```mermaid
classDiagram
    class Server {
        +app express
        +start()
    }
    class DB {
        +pool connection
        +query()
    }
    class AuthRoutes {
        +login()
        +register()
    }
    class SlotRoutes {
        +create()
        +getByNgo()
    }
    class BookingRoutes {
        +create()
        +list()
    }
    class EnrollmentRoutes {
        +create()
        +list()
    }
    
    Server --> AuthRoutes
    Server --> SlotRoutes
    Server --> BookingRoutes
    Server --> EnrollmentRoutes
    AuthRoutes ..> DB
    SlotRoutes ..> DB
    BookingRoutes ..> DB
    EnrollmentRoutes ..> DB
```

## 6. Sequence Diagram (Booking Flow)
```mermaid
sequenceDiagram
    participant C as Candidate
    participant B as Backend API
    participant D as MySQL DB
    
    C->>B: POST /api/bookings {candidateId, slotId, ngoId}
    B->>D: SELECT capacity, booked FROM time_slots WHERE id = slotId
    D-->>B: {capacity: 10, booked: 5}
    alt Capacity Available
        B->>D: INSERT INTO bookings (...)
        B->>D: UPDATE time_slots SET booked = booked + 1
        D-->>B: Success
        B-->>C: 201 Created (Booking details)
    else Fully Booked
        B-->>C: 400 Bad Request (Slot full)
    end
```

## 7. State Chart Diagram (Time Slot)
```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> PartiallyBooked : First booking
    PartiallyBooked --> PartiallyBooked : More bookings
    PartiallyBooked --> FullyBooked : Capacity reached
    Available --> FullyBooked : Capacity reached (bulk)
    FullyBooked --> Expired : Date passes
    PartiallyBooked --> Expired : Date passes
    Available --> Expired : Date passes
    Expired --> [*]
```

## 8. Activity Diagram (User Journey)
```mermaid
activityDiagram
    start
    :User Opens Web Page;
    if (Is Registered?) then (No)
        :Register (NGO or Candidate);
    endif
    :Login;
    if (User Type?) then (Candidate)
        :Search NGOs;
        :View NGO Details;
        :Select Time Slot;
        :Confirm Booking;
    else (NGO Admin)
        :View Dashboard;
        :Create New Time Slot;
        :Manage Enrollments;
    endif
    stop
```
