import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppState } from '../state/AppState';
import { useNav } from '../navigation/Nav';
import { Btn, Field, Header, Label, Screen } from '../ui/parts';
import { colors } from '../ui/theme';
import { currentStep } from '../domain/selectors';
import { formatClock } from '../domain/date';

const SIZE = 260;
const STROKE = 36;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

type Phase = 'running' | 'paused' | 'resting' | 'done';

export function FocusScreen() {
  const { data, dispatch } = useAppState();
  const nav = useNav();
  const step = currentStep(data);
  const stepKey = step ? `${step.task.id}:${step.stepId ?? 'task'}` : 'none';
  const totalSec = (step?.minutes ?? 5) * 60;

  const [phase, setPhase] = useState<Phase>('running');
  const [endAt, setEndAt] = useState(() => Date.now() + totalSec * 1000);
  const [pausedLeft, setPausedLeft] = useState(totalSec * 1000);
  const [now, setNow] = useState(Date.now());
  const [memo, setMemo] = useState('');
  const [memoSaved, setMemoSaved] = useState('');
  const [finishedLabel, setFinishedLabel] = useState('');

  // 一歩が変わったらタイマーを最初から
  useEffect(() => {
    if (phase === 'done') return;
    setEndAt(Date.now() + totalSec * 1000);
    setPausedLeft(totalSec * 1000);
    setPhase('running');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const leftMs = phase === 'running' ? endAt - now : pausedLeft;
  const over = leftMs < 0;
  const ratio = over ? 0 : Math.min(1, leftMs / (totalSec * 1000));

  const pause = (next: Phase) => {
    setPausedLeft(endAt - Date.now());
    setPhase(next);
  };
  const resume = () => {
    setEndAt(Date.now() + pausedLeft);
    setPhase('running');
  };

  const complete = () => {
    if (!step) return;
    setFinishedLabel(step.label);
    dispatch({ type: 'COMPLETE_CURRENT_STEP', id: step.task.id });
    setPhase('done');
  };

  const startNext = () => {
    setEndAt(Date.now() + totalSec * 1000);
    setPausedLeft(totalSec * 1000);
    setPhase('running');
  };

  const saveMemo = () => {
    const v = memo.trim();
    if (!v) return;
    dispatch({ type: 'ADD_TASK', title: v });
    setMemo('');
    setMemoSaved(v);
  };

  if (phase === 'done') {
    return (
      <Screen dark>
        <Header title="" dark />
        <View style={styles.doneBox}>
          <Text style={styles.doneBig}>できた</Text>
          <Text style={styles.doneSub}>「{finishedLabel}」</Text>
        </View>
        {step ? (
          <View style={{ gap: 10 }}>
            <Label dark>次の一歩</Label>
            <Text style={styles.nextTitle}>{step.label}</Text>
            <Btn kind="accent" label={`次の一歩を、${step.minutes}分で`} onPress={startNext} />
            <Btn kind="outlineDark" label="今日はここまで（ホームへ）" onPress={nav.home} />
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            <Text style={styles.doneSub}>やることは全部終わりました。</Text>
            <Btn kind="accent" label="ホームへ" onPress={nav.home} />
          </View>
        )}
      </Screen>
    );
  }

  if (!step) {
    return (
      <Screen dark>
        <Header title="集中" dark />
        <Text style={styles.doneSub}>いま やることがありません。ホームで追加してください。</Text>
        <Btn kind="accent" label="ホームへ" onPress={nav.home} />
      </Screen>
    );
  }

  return (
    <Screen dark>
      <Header title={step.total > 1 ? `${step.index + 1}歩目 / 全${step.total}歩` : '集中'} dark />

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={styles.eyebrow}>いま やること</Text>
        <Text style={styles.stepTitle}>{step.label}</Text>
      </View>

      <View style={{ alignItems: 'center' }} accessible accessibilityLabel={over ? '時間を過ぎています' : `残り${formatClock(leftMs / 1000)}`}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="#2C5060" strokeWidth={STROKE} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={colors.accent}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={CIRC * (1 - ratio)}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>
          <View style={styles.clockCenter}>
            <Text style={styles.clock}>{over ? `+${formatClock(-leftMs / 1000)}` : formatClock(leftMs / 1000)}</Text>
            <Text style={styles.clockSub}>{over ? '過ぎた時間' : phase === 'running' ? 'のこり' : '止めています'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.gentle}>
        {phase === 'resting'
          ? '休んでOK。戻ってきたら「再開」を押すだけ。'
          : '時間が過ぎても大丈夫。終わったら「できた」を押すだけ。'}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {phase === 'running' ? (
          <Btn kind="outlineDark" label="ちょっと休む" onPress={() => pause('resting')} style={{ flex: 1 }} />
        ) : (
          <Btn kind="outlineDark" label="再開" onPress={resume} style={{ flex: 1 }} />
        )}
        <Btn kind="accent" label="できた" onPress={complete} style={{ flex: 1 }} />
      </View>

      <View style={{ gap: 8, marginTop: 'auto' }}>
        <Label dark>気になったことは置いて、あとで考える</Label>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Field
            dark
            value={memo}
            onChangeText={setMemo}
            onSubmitEditing={saveMemo}
            placeholder="例：明日の持ち物を確認"
            style={{ flex: 1, minWidth: 0 }}
            accessibilityLabel="気になったことのメモ"
          />
          <Btn kind="outlineDark" label="置く" onPress={saveMemo} style={{ minHeight: 48, minWidth: 64 }} />
        </View>
        {memoSaved !== '' && <Text style={styles.saved}>「{memoSaved}」を あとでやること に置きました</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 12, letterSpacing: 1, color: colors.deepSub },
  stepTitle: { fontSize: 24, fontWeight: '700', color: '#F2F6F5', textAlign: 'center', lineHeight: 34 },
  clockCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  clock: { fontSize: 52, fontWeight: '700', color: '#F2F6F5', fontVariant: ['tabular-nums'] },
  clockSub: { fontSize: 13, color: colors.deepSub },
  gentle: { fontSize: 13, color: colors.deepSub, textAlign: 'center', lineHeight: 20 },
  saved: { fontSize: 13, color: '#CFE1E5' },
  doneBox: { alignItems: 'center', gap: 8, paddingVertical: 32 },
  doneBig: { fontSize: 40, fontWeight: '700', color: colors.accent },
  doneSub: { fontSize: 15, color: '#CFE1E5', textAlign: 'center', lineHeight: 22 },
  nextTitle: { fontSize: 22, fontWeight: '700', color: '#F2F6F5', lineHeight: 30 },
});
