<script setup lang="ts">
import { computed, reactive } from 'vue';
import WelcomeItem from './WelcomeItem.vue';

const props = withDefaults(
  defineProps<{
    texts: string[];
  }>(),
  {
    texts: () => [
      'This is the first quick text message that is hard coded.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'This is the first quick text message that is hard coded.'
    ]
  }
);

async function shareItem(data: string) {
  const shareData = {
    title: 'Quick Text',
    url: undefined,
    text: data
  };

  await navigator.share(shareData);
}

function addMsg() {
  state.texts.push(state.msgToAdd);
  state.msgToAdd = '';
}

const state = reactive({
  msgToAdd: '',
  texts: [] as string[]
});

const propAndStateTexts = computed(() => [...state.texts, ...props.texts]);
</script>

<template>
  <div>
    <input type="text" name="msgAdd" v-model="state.msgToAdd" />
    <input type="button" value="Add" @click="addMsg" />
  </div>
  <WelcomeItem v-for="text in propAndStateTexts" :key="text">
    <template #icon>
      <span @click="shareItem(text)">💬</span>
    </template>
    {{ text }}
  </WelcomeItem>
</template>
