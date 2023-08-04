# HATOM NFT ARBITRER

---
<h1>Installation</h1>
Go to the place in which you want to clone.

~~~
git clone https://github.com/Thekthekthek/Hatom-NFT-arbitrer.git
~~~
then install the modules :
~~~
npm i
~~~

<h2>Explanation</h2>
This following repo contains a project which have as a purpose to track the incoming and outgoing NFTs listed on the XOXNO Marketplace (main marketplace) of the MultiversX network. 

&nbsp;
In this very case, the NFTs represents Elronds that can be claimed for the value their represent. For example, an NFT called "1 EGLD" could be traded back to 1 EGLD when the lockdown is done (10 days). 
&nbsp;
This mechanism is made by Hatom in order to allow the liquid staking to works. Hence, some peoples might not want to wait for those 10 days and will then propose a smaller price in order to make it sellable. 
&nbsp;
The purpose of this module is to analyze the marketplace flow and return an array which contains at the first position the best ROI NFT to buy (auctionID, identifier and gain).

<h3>try it</h3>
&nbsp;
you can try the script by running on your cloned repository :

~~~
node index.js
~~~

