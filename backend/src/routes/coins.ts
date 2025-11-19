import Router from 'express'
import supabase from '../supabase';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const currentCoisValue = await supabase.from('coins').select('total').eq('user_id', userId).single();

  console.log('CCV:', currentCoisValue.data?.total);

  return res.json({
    totalCoins: currentCoisValue.data?.total || 0,
  });
})

export default router;