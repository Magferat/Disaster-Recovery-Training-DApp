// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract UserManagement {

    /*
    ==============================================================
                              Enum and Struct
    ===============================================================
    */
    enum TrainingType { first_aid, shelter_rebuild, food_safety }
    
    enum Role { Admin, Participant, Trainer }


    struct User {
        uint256 id;
        string name;
        Role role;
        address wallet_addr;

        bool isRegistered;
        uint8 age;
        string gender;
        string district;
        TrainingType training_interest;

        bool has_completed_training;
    }

    struct Booking {
        address participant;
        address trainer;
        uint256 startTime;
        uint256 endTime;
        uint256 paidFee;
    }

    /*
    =======================================================================
                     State Variable, Modifiers, constructor
    =======================================================================
    */
    address public owner;

    uint256 private participantCounter = 0;

    uint256 public bookingFee = 0.01 ether;




    mapping(address => User) public users;

    mapping(address => Booking[]) private trainerBookings;

    User[] private admins;
    User[] private participants;
    User[] private trainers;
    // Booking[] public allBookings;

    modifier onlyAdmin() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == Role.Admin, "Only admins can call this function");
        _;
    }

    modifier onlyParticipant() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == Role.Participant, "Only participants can call this function");
        _;
    }

    modifier userExists(address user_addr) {
        require(users[user_addr].isRegistered, "User does not exist");
        _;
    }
    

    constructor() {
        owner = msg.sender;
        users[msg.sender] = User({
            id: 0,
            name: "Admin 0",
            role: Role.Admin,
            wallet_addr: msg.sender,

            isRegistered: true,
            age: 20,
            gender: "",
            district: "",

            training_interest: TrainingType.first_aid,

            has_completed_training: false
        });
        admins.push(users[msg.sender]);
    }

    /*
    ==============================================================
                       private function
    =============================================================
    */
    function registerUser(
        string memory userName,
        Role userRole,
        uint8 userAge,

        string memory userGender,
        string memory userDistrict,

        TrainingType interested_type
    ) 
        private 
    {
        require(!users[msg.sender].isRegistered, "User already registered");

        require(bytes(userName).length > 0, "Name cannot be empty");
       
        if (userRole == Role.Participant) {
            
            require(userAge > 0, "Invalid age");

            require(bytes(userGender).length > 0, "Please provide your gender");

            require(bytes(userDistrict).length > 0, "Please provide your district");
        }

        uint256 userId = (userRole == Role.Participant) ? ++participantCounter : 0;

        User memory newUser = User({
            id: userId,

            name: userName,
            role: userRole,

            wallet_addr: msg.sender,
            isRegistered: true,
            age: (userRole == Role.Participant) ? userAge : 20,

            gender: (userRole == Role.Participant) ? userGender : "",

            district: (userRole == Role.Participant) ? userDistrict : "",

            training_interest: (userRole == Role.Participant) ? interested_type : TrainingType.first_aid,

            has_completed_training: false
        });

        users[msg.sender] = newUser;

        if (userRole == Role.Admin) admins.push(newUser);

        else if (userRole == Role.Participant) participants.push(newUser);

        else if (userRole == Role.Trainer) trainers.push(newUser);
    }

    function update_participant_Array(address participantAddr) internal {

        for (uint256 i = 0; i < participants.length; i++) {

            if (participants[i].wallet_addr == participantAddr) {

                participants[i] = users[participantAddr];

                break;
            }
        }
    }

    /*
    ==============================================================
                          external and view functions
    ===============================================================
    */


    function registerAsAdmin(string memory userName) external {
        registerUser(userName, Role.Admin, 0, "", "", TrainingType.first_aid);
    }

    function registerAsTrainer(string memory userName) external {
        registerUser(userName, Role.Trainer, 0, "", "", TrainingType.first_aid);
    }

    function registerAsParticipant(
        string memory userName,
        uint8 userAge,
        string memory userGender,
        string memory userDistrict,
        TrainingType interested_type
    ) 
 external  {
        require(uint(interested_type) <= 2,"Invalid training type");
        registerUser(userName, Role.Participant, userAge, userGender, userDistrict, interested_type);
    }

    function updateInterest(address participantAddr,  uint8 new_Inter) external onlyAdmin userExists(participantAddr){

        require(users[participantAddr].role == Role.Participant, "Not a participant");

        if (new_Inter > 2) {revert("Invalid training type");}

        users[participantAddr].training_interest =  TrainingType(new_Inter);
        update_participant_Array(participantAddr);
    }

    function updateStatus(address participantAddr, bool status ) external onlyAdmin userExists(participantAddr) {
        
        require(users[participantAddr].role == Role.Participant, "Not a participant");
        require(!users[participantAddr].has_completed_training || status, "Cannot change completion status from true to false");
        
        users[participantAddr].has_completed_training = status;
        
        
        update_participant_Array(participantAddr);
    }

    
    function bookTrainingSlot(address trainer, uint256 startTime )external payable onlyParticipant {
        
        
        require(users[trainer].role == Role.Trainer, "Invalid trainer");
        require(msg.value == bookingFee, "Incorrect booking fee");

        uint256 endTime = startTime + 30 minutes;
        
        Booking[] storage bookings = trainerBookings[trainer];

        for (uint256 i = 0; i < bookings.length; i++) {
            bool overlap = (startTime < bookings[i].endTime) && (endTime > bookings[i].startTime);
           
           
            require(!overlap, "Slot overlaps");
        }

        bookings.push(Booking({
            participant: msg.sender,
            trainer: trainer,
            startTime: startTime,
            endTime: endTime,
            paidFee: msg.value
        }));
        // allBookings.push(bookings[bookings.length - 1]);
        payable(owner).transfer(msg.value);
    }
 function viewAllTrainingSchedules() external view returns ( Booking[][] memory allBookings ) {
        
        allBookings = new Booking[][](trainers.length);
        for (uint256 i = 0; i < trainers.length; i++) {

            allBookings[i] = trainerBookings[trainers[i].wallet_addr];
        }
        return allBookings;

    }

    function getParticipants() external view onlyAdmin returns (User[] memory) { return participants;}

    function getTrainers() external view returns (User[] memory) {return trainers;}

    function getAdmins() external view returns (User[] memory) {return admins;}


    function getBookingsForTrainer(address trainer) external view returns (Booking[] memory) {
        return trainerBookings[trainer];
    }

   
}
