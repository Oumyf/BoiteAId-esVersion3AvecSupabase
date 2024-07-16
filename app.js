const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvanFlaGJoYnZlcW5wb3RvZHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNDU2MDQsImV4cCI6MjAzNjYyMTYwNH0.79NhgxujvfRvNeMM3RONAHuHfYXjlswFTajiklxjrW4";
const url = "https://pojqehbhbveqnpotodrx.supabase.co";
const database = supabase.createClient(url, key);

let save = document.querySelector("#save");
save.addEventListener('click', async (e) => {
    e.preventDefault();
    alert("cela marche!!!");
    const libelle = document.querySelector('#libelle').value;
    const description = document.querySelector("#description").value;
    const categorie = document.querySelector("#categorie").value;
    const image = document.querySelector("#image").value;

    save.innerText = "enregistrement...";
    save.setAttribute("disabled", true);

    try {
        const { data, error } = await database.from("idees").insert({
            libelle: libelle,
            description: description,
            categorie: categorie,
            image: image,
            statut: 'en attente'  // Initialiser avec le statut 'en attente'
        });

        if (error) {
            console.error('Insert error:', error);
            alert(`Insert error: ${error.message}`);
        } else {
            console.log('Insert success:', data);
            alert('Idée ajoutée avec succès!');
            await getIdee();  // Actualiser le tableau après l'insertion
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Idée non ajoutée !');
    } finally {
        save.innerText = "enregistrer";
        save.removeAttribute("disabled");
        document.querySelector("#exampleModal").style.display = 'none';
        document.querySelector('#libelle').value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#categorie").value = "";
        document.querySelector("#image").value = "";
    }
});
const getIdee = async () => {
    let tbody = document.getElementById("tbody");
    let chargement = document.getElementById("chargement");
    let tr = "";

    chargement.innerText = 'En chargement...';
    try {
        const { data, error } = await database.from("idees").select("*");

        if (error) {
            console.error('Fetch error:', error);
            chargement.innerText = "Erreur de chargement";
        } else {
            data.forEach((idee, index) => {
                let actions = '';
                if (idee.statut === 'en attente') {
                    actions = `
                        <button class="btn btn-success" onclick="approveIdee(${idee.id})">Approuver</button>
                        <button class="btn btn-warning" onclick="disapproveIdee(${idee.id})">Désapprouver</button>
                    `;
                } else if (idee.statut === 'approuvé') {
                    actions = `<button class="btn btn-warning" onclick="disapproveIdee(${idee.id})">Désapprouver</button>`;
                } else if (idee.statut === 'désapprouvé') {
                    actions = `<button class="btn btn-success" onclick="approveIdee(${idee.id})">Approuver</button>`;
                }

                tr += `
                    <tr>
                        <td><img src="${idee.image}" width="100" height="100" alt="Image"></td>
                        <td>${index + 1}</td>
                        <td>${idee.libelle}</td>
                        <td>${idee.description}</td>
                        <td>${idee.categorie}</td>
                        <td>${idee.statut}</td>
                        <td>${actions}</td>
                        <td><button class="btn btn-danger" onclick="deleteIdee(${idee.id})">Supprimer</button></td>
                    </tr>
                `;
            });
            tbody.innerHTML = tr;
            chargement.innerText = "Chargement terminé";
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        chargement.innerText = "Erreur de chargement";
    }
};

// Appel initial pour charger les idées
getIdee();


const getTotalCount = async () => {
    let total = document.querySelector("#total")
    const res = await database.from("idees").select("*", { count: "exact" });
    total.innerText = res.data.length;
}
getTotalCount();

const deleteIdee = async (id) => {
    try {
        const { data, error } = await database.from("idees").delete().eq("id", id);

        if (error) {
            console.error('Delete error:', error);
            alert(`Erreur de suppression: ${error.message}`);
        } else {
            console.log('Delete success:', data);
            alert('Suppression réussie');
            await getIdee();  // Actualiser le tableau après la suppression
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Erreur inattendue lors de la suppression');
    }
};

const approveIdee = async (id) => {
    try {
        const { data, error } = await database.from("idees").update({ statut: 'approuvé' }).eq("id", id);

        if (error) {
            console.error('Approval error:', error);
            alert(`Erreur d'approbation: ${error.message}`);
        } else {
            console.log('Approval success:', data);
            alert('Idée approuvée');
            await getIdee();  // Actualiser le tableau après l'approbation
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Erreur inattendue lors de l\'approbation');
    }
};

const disapproveIdee = async (id) => {
    try {
        const { data, error } = await database.from("idees").update({ statut: 'désapprouvé' }).eq("id", id);

        if (error) {
            console.error('Disapproval error:', error);
            alert(`Erreur de désapprobation: ${error.message}`);
        } else {
            console.log('Disapproval success:', data);
            alert('Idée désapprouvée');
            await getIdee();  // Actualiser le tableau après la désapprobation
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Erreur inattendue lors de la désapprobation');
    }
};

// Appel initial pour charger les idées
getIdee();





