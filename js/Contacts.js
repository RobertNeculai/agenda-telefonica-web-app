window.PhoneBook ={
    API_BASE_URL:"http://localhost:8081/contacts",
    getContacts: function () {
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            PhoneBook.displayContacts(JSON.parse(response));
        })
    },
    createContacts: function () {
        let firstNameValue=$("#first_name-field").val();
        let lastNameValue=$("#last_name-field").val();
        let phoneNumberValue=$("#phonenumber-field").val();

        let requestBody={
            firstName: firstNameValue,
            lastName: lastNameValue,
            phonenumber: phoneNumberValue
        };
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "POST",
            //also known as MIME type
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function (requestBody) {
            PhoneBook.getContacts();
        })
    },
    updateContacts: function(id,phonenumber){
        let requestBody={
           phonenumber: phonenumber
        };
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id="+id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            PhoneBook.getContacts();
        });
    },
    deleteContacts: function(id) {
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "DELETE",
        }).done(function () {
            PhoneBook.getContacts();
        });
    },
    getContactRow: function (contact) {
        // spread operator( ... )
        //ternary operator
        // same result as using if else statements
        return `<tr>
            <td> ${contact.last_name} </td>
            <td> ${contact.first_name} </td>
            <td> ${contact.phonenumber} </td>
            <td><input type="button" value="Update Phone Number" data-id=${contact.id}  class="update-mark"></td>
            <td><a href="#" data-id="${contact.id}" class="delete-contact"> <i class="fas fa-trash-alt"></i>
            </a> </td>
        </tr>`
    },

    updatePhoneNumber: function(id) {
       let pn= $(".update-mark").replaceWith($(`<input type="tel" placeholder="Enter new Phone Number" data-id=${id} class="phonebook-update">`),`<input type="button" data-id=${id} value="Submit Changes" class="submit-mark">`);
    },
    displayContacts: function (contacts) {
        // weak-typed (javascript) vs strong-typed (java)
        var tableBody = '';
        contacts.forEach(contact => tableBody+=PhoneBook.getContactRow(contact));
        $("#Contacts-table tbody").html(tableBody);
    },
    bindEvents:function (contact) {
        //capturing Submit-form event for function binding
        $("#new-contact-form").submit(function (event) {
            event.preventDefault();
            PhoneBook.createContacts();
        });
        //delegate is neccesary since .mark-done element does not exist on initialise
        $("#Contacts-table").delegate(".update-mark", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            PhoneBook.updatePhoneNumber(contactId);
        });
        $("#Contacts-table").delegate(".submit-mark","click",function (event) {

            event.preventDefault();
            let contactId=$(this).data("id");
            let phonenumber = $(this).siblings(".phonebook-update").val();

            if(phonenumber==null || phonenumber=="" || !phonenumber?.match("(?=.*[0-9]).*"))
            {
                console.log("Cannot update with null or non-numeric value")
                PhoneBook.getContacts();
            }
            else {
                //reading value of attributes prefixed with "data-"
                PhoneBook.updateContacts(contactId, phonenumber);
            }

        });
        $("#Contacts-table").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            //reading value of attributes prefixed with "data-"
            let contactId = $(this).data("id");
            PhoneBook.deleteContacts(contactId);
        });
    }
};

//from api
PhoneBook.getContacts();
PhoneBook.bindEvents();