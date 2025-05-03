const posts = [
    {
        id:1,
        userName:"Ayelet", 
        title: "Header3",
        content:`As votes continue to be tabulated across the country, news media, pollsters and various supporting analysts have declared that the Liberals are projected to win sufficient ridings across Canada and are expected to form Government in 
        Canada's 45th Parliament.In the hours and maybe days to come, the final ballots will be counted and the final composition of the House of Commons will be determined.
        Heightened moderation will continue; with more conviction in modding when it comes to incivility: Please do discuss but be aware any content that attacks individuals or is extremely negative and generalizing will continue to be dealt with.`
    },
    {
        id:2,
        userName:"Ido",
        title: "Header1",
        content:`Millions of Canadians have cast their ballot for a party and candidate different than your own. Regardless of this result, please remain civil and polite.
                Alors que le dépouillement des votes se poursuit partout au pays, les médias, les sondeurs et divers analystes affirment que les libéraux devraient remporter suffisamment de circonscriptions au Canada et former le gouvernement lors de la 45e législature du Canada.
                Dans les heures, voire les jours à venir, les derniers bulletins de vote seront dépouillés et la composition définitive de la Chambre des communes sera déterminée.`
    },
    {
        id:3,
        userName:"Moriel",
        title: "Header2",
        content:`Amazon doesn’t want to shoulder the blame for the cost of President Donald Trump’s trade war.
                So the e-commerce giant will soon show how much Trump’s tariffs are adding to the price of each product, according to a person familiar with the plan.
                The shopping site will display how much of an item’s cost is derived from tariffs – right next to the product’s total listed price.`
    }
]

const comments = [
    {
        id:1,
        postId:1,
        userName:"Mira",
        content:"woww good to know"
    },
    {
        id:2,
        postId:2,
        userName:"Shirel",
        content:"so what"
    },
    {
        id:3,
        postId:2,
        userName:"Omer",
        content:"They fill the gap if even one is absent. No in strength or navigating but as a second captain."
    },
] 

module.exports = {posts, comments}