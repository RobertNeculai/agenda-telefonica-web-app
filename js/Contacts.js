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
        let emailValue=$("#email-field").val();

        let requestBody={
            first_name: firstNameValue,
            last_name: lastNameValue,
            phonenumber: phoneNumberValue,
            email: emailValue
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
    updateContactsPhoneNumber: function(id,phonenumber){
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
            <td> ${contact.email} </td>
            <td><input type="button" value="Update Phone Number" data-id=${contact.id}  class="update-mark"></td>
            <td><a href="#" data-id="${contact.id}" class="delete-contact"> <i class="fas fa-trash-alt"></i>
            </a> </td>
        </tr>`
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
        $("#email-checkbox").change(function (event) {
            event.preventDefault();
            $(this).replaceWith($(`<input type="text" id="email-field" placeholder="Enter email adress">`));
        });
        //delegate is neccesary since .mark-done element does not exist on initialise
        $("#Contacts-table").delegate(".update-mark", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            $(this).replaceWith($(`<input type="tel" placeholder="Enter new Phone Number" data-id=${contactId} class="phonebook-update">`),
                `<input type="button" data-id=${contactId} value="Submit Changes" class="submit-mark">`);
        });
        $("#Contacts-table").delegate(".submit-mark","click",function (event) {
            event.preventDefault();
            let contactId=$(this).data("id");
            let phonenumber = $(this).siblings(".phonebook-update").val();

            if(phonenumber==null || phonenumber=="" || !phonenumber?.match("(?=.*[0-9]).*"))
            {
                console.log("Cannot update with null or non-numeric value");
                $(this).siblings(".phonebook-update").val("");
                /*PhoneBook.getContacts();*/
            }
            else {
                //reading value of attributes prefixed with "data-"
                PhoneBook.updateContactsPhoneNumber(contactId, phonenumber);
            }
        });
        $("#Contacts-table").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            PhoneBook.deleteContacts(contactId);
        });
    }
};

//from api
PhoneBook.getContacts();
PhoneBook.bindEvents();