<script>
import wxCloud from '@/common/js/cloud_service.js';
        
export default {
    onLaunch: function() {
        wxCloud.getBaiduToken();
        console.log('App.vue-App Launch');
    },
    onShow: function() {
        console.log('App.vue-App Show');
    },
    onHide: function() {
        console.log('App.vue-App Hide');
    }
};
</script>

<style>
/*每个页面公共css */
</style>
