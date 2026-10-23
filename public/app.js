const searchInput=document.getElementById("searchEmail");
const rows=document.querySelectorAll("#userTable tr"); // here rows are a collection
const noResult=document.getElementById("noResult");
const tbody=document.getElementById("userTable");
searchInput.addEventListener("input",function(){
    const searchValue=this.value.trim().toLowerCase();
    let matchFound=false;
    rows.forEach(function(row){
        // line no.10 doubt 
        const email=row.querySelector(".userEmail").textContent.trim().toLowerCase();
      let isMatch = false;

if (searchValue !== "" && email===searchValue) {
    isMatch = true;
    tbody.prepend(row);
}
else{
    tbody.append(row);
}
// Agar email match hui toh row highlight karo
if (isMatch == true) {
    row.classList.add("highlight");
    matchFound = true;
} else {
    row.classList.remove("highlight");
}
});

// No matching users ka message show/hide karo
if (searchValue !== "" && matchFound == false) {
    noResult.style.display = "block";
} else {
    noResult.style.display = "none";
}
});

// line no.10 doubt clear
      // Agar tum likhte:
// const email = document.querySelector(".userEmail").textContent;


// Toh document poore HTML document mein search karega aur sirf pehla matching element return karega.

// Lekin humein har row ka email chahiye, taaki usko search input se compare kar sakein.
//    Yahan:
// - rows[i] → ek HTML <tr> element.
// - row.querySelector(...) → us row ke andar email wala <td> dhoondhta hai.
// - .textContent → email ka text deta hai.
// Agar tum likhoge:
// let email = row[i].email;


// Toh error ya undefined milega, kyunki row ek HTML element hai, users ka object nahi.