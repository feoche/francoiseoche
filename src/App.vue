<template>
  <div class="overflow-x-hidden">
    <section class="relative flex flex-col items-center px-auto py-32" id="hero">
      <h1 class="inline-block text-white text-5xl font-bold mb-5">SpeeedRennes</h1>
      <h2 class="inline-block text-white text-2xl">Collectif de speedrun sur Rennes et alentours</h2>
    </section>

    <div class="bg-gray-100">
      <section class="container flex flex-col p-20 mx-auto">
        <h2 class="text-2xl font-bold mb-5">Le collectif SpeedRennes</h2>

        <p class="text-lg">Ce collectif a pour but de présenter des commentaires de speedrun de jeux vidéo, au sein d'évènements externes
          (<a class="text-blue-600" href="https://gamesdonequick.com"><abbr title="Awesome Games Done Quick">AGDQ</abbr></a>, <a
              class="text-blue-600" href="http://bourglarun.fr"><abbr title="Bourg La Run">BLR</abbr></a>, <a
              class="text-blue-600" href="https://esamarathon.com"><abbr title="European Speedrunner Assembly">ESA</abbr></a>, ...) ou de
          manière indépendante.</p>
      </section>
    </div>

    <div class="bg-gray-700">
      <section class="container flex flex-col p-20 mx-auto">
        <h2 class="text-2xl font-bold text-white mb-5">Les membres du collectif</h2>

        <div class="flex gap-5">
          <div class="bg-white rounded w-1/4 shadow hover:shadow-md duration-4">
            <div class="flex flex-row justify-between uppercase font-bold text-blue-dark border-b p-6">
              <p><b>Olmo</b> - <em>ElBlaireau</em></p>
            </div>
            <div class="p-6 text-grey-darker text-justify flex flex-col">
              <img src="https://pbs.twimg.com/profile_images/631834850958438400/FzAJ3V17_400x400.jpg"
                   alt="Some image" class="w-64 flex self-center rounded-full shadow-lg mb-6">
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Sa spécialité</p>
              <span class="text-grey-darker mb-5">
                <em>Shmups et RPGs</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Ses speedruns</p>
              <span class="text-grey-darker mb-5">
                <em>Super Dangerous Dungeon</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Speedrun préféré</p>
              <span class="text-grey-darker mb-5">
                <em>TAS Super Mario 64, Punch-Out Blindfold%</em>
              </span>
            </div>
          </div>

          <div class="bg-white rounded w-1/4 shadow hover:shadow-md duration-4">
            <div class="flex flex-row justify-between uppercase font-bold text-blue-dark border-b p-6">
              <p><b>Julien</b> - <em>Hawkrex</em></p>
            </div>
            <div class="p-6 text-grey-darker text-justify flex flex-col">
              <img src="data:image/jpeg;base64,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"
                   alt="Some image" class="w-64 flex self-center rounded-full shadow-lg mb-6">
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Sa spécialité</p>
              <span class="text-grey-darker mb-5">
                <em>La tech</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Ses speedruns</p>
              <span class="text-grey-darker mb-5">
                <em>Super Dangerous Dungeon</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Speedrun préféré</p>
              <span class="text-grey-darker mb-5">
                <em>TAS Super Mario 64, Punch-Out Blindfold%</em>
              </span>
            </div>
          </div>

          <div class="bg-white rounded w-1/4 shadow hover:shadow-md duration-4">
            <div class="flex flex-row justify-between uppercase font-bold text-blue-dark border-b p-6">
              <p><b>Jean-Phi</b> - <em>Langveiler</em></p>
            </div>
            <div class="p-6 text-grey-darker text-justify flex flex-col">
              <img src="https://www.speedthemall.com/uploads/users/avatar61899ab76bd56.png"
                   alt="Some image" class="w-64 flex self-center rounded-full shadow-lg mb-6">
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Sa spécialité</p>
              <span class="text-grey-darker mb-5">
                <em>Les speedruns drôles et absurdes</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Ses speedruns</p>
              <span class="text-grey-darker mb-5">
                <em>P.N.03</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Speedrun préféré</p>
              <span class="text-grey-darker mb-5">
                <em>Super Mario Sunshine</em>
              </span>
            </div>
          </div>

          <div class="bg-white rounded w-1/4 shadow hover:shadow-md duration-4">
            <div class="flex flex-row justify-between uppercase font-bold text-blue-dark border-b p-6">
              <p><b>François</b> - <em>starsky</em></p>
            </div>
            <div class="p-6 text-grey-darker text-justify flex flex-col">
              <img src="https://avatars2.githubusercontent.com/u/5332505?s=400&u=d2cf9ede9dfad7f4875fd71dffb10fa400526827&v=4"
                   alt="Some image" class="w-64 flex self-center rounded-full shadow-lg mb-6">
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Sa spécialité</p>
              <span class="text-grey-darker mb-5">
                <em>TAS, runs de consoles de 6ème génération</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Ses speedruns</p>
              <span class="text-grey-darker mb-5">
                <em>Steamworld Dig (ben oui, faut bien platiner le jeu !)</em>
              </span>
              <p class="font-bold text-sm uppercase mb-2 text-blue-darker">Speedrun préféré</p>
              <span class="text-grey-darker mb-5">
                <em>Super Mario Odyssey Any%</em>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>


    <div class="bg-gray-300">
      <section class="container flex flex-col px-20 py-10 mx-auto">
        <h2 class="text-2xl font-bold mb-5">Nous contacter</h2>

        <div class="flex m-5 gap-5">
          <a class="flex w-1/4 bg-gray-100 rounded-lg items-center flex-col gap-5 py-5" href="https://discord.gg/yrEdJ28">
            <img class="w-14 flex self-center rounded-full" alt="Contact via Discord" src="https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-128.png">
            <p class="font-bold text-lg text-blue-700">Discord</p>
          </a>
          <a class="flex w-1/4 bg-gray-100 rounded-lg items-center flex-col gap-5 py-5" href="https://twitter.com/speeedrennes">
            <img class="w-14 flex self-center rounded-full" alt="Contact via Twitter" src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-128.png">
            <p class="font-bold text-lg text-blue-700">Twitter</p>
          </a>
          <a class="flex w-1/4 bg-gray-100 rounded-lg items-center flex-col gap-5 py-5" href="https://www.facebook.com/speeedrennes">
            <img class="w-14 flex self-center rounded-full" alt="Contact via Facebook" src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/facebook_circle-128.png">
            <p class="font-bold text-lg text-blue-700">Facebook</p>
          </a>
          <a class="flex w-1/4 bg-gray-100 rounded-lg items-center flex-col gap-5 py-5" href="mailto:speeedrennes@gmail.com">
            <img class="w-14 flex self-center rounded-full" alt="Contact via Mail" src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/mail-128.png">
            <p class="font-bold text-lg text-blue-700">Mail</p>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
#hero:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: -10px;
  background: url("https://images.unsplash.com/photo-1513528473392-f3fffb1b31a9") no-repeat center center;
  background-size: cover;
  -webkit-filter: blur(5px);
  filter: blur(5px);
  z-index: -1;
}
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    showMenu: false,
    showProfileMenu: false,
    links: [
      { text: 'Home', to: '/' },
      { text: 'About', to: '/about' },
    ],
  }),
})
</script>
